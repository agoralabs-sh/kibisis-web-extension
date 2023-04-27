import { decode as decodeAsHex, encode as encodeHex } from '@stablelib/hex';
import { decodeAddress, encodeAddress } from 'algosdk';
import { v4 as uuid } from 'uuid';

// Config
import { networks } from '@extension/config';

// Constants
import { ACCOUNTS_ITEM_KEY_PREFIX } from '@extension/constants';

// Service
import StorageManager from './StorageManager';

// Types
import { IBaseOptions, ILogger } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IInitializeAccountOptions,
  INetwork,
} from '@extension/types';

// Utils
import { convertGenesisHashToHex } from '@extension/utils';

export default class AccountService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * Public static functions
   */

  /**
   * Convenience function that simply converts an Algorand address to hexadecimal encoded public key.
   * @param {string} address - the Algorand address to convert.
   * @returns {string} a hexadecimal encoded public key from the Algrand address.
   */
  public static convertAlgorandAddressToPublicKey(address: string): string {
    return encodeHex(decodeAddress(address).publicKey).toUpperCase();
  }

  /**
   * Convenience function that simply converts a hexadecimal encoded public key to an Algorand address.
   * @param {string} encodedPublicKey - the hexadecimal encoded public key.
   * @returns {string} an Algorand address derived from the hexadecimal encoded public key.
   */
  public static convertPublicKeyToAlgorandAddress(
    encodedPublicKey: string
  ): string {
    return encodeAddress(decodeAsHex(encodedPublicKey.toUpperCase()));
  }

  /**
   * Convenience function that extracts the account for a given network.
   * @param {IAccount} account - the account to get the account information from.
   * @param {INetwork} network - the network to look for.
   * @returns {IAccountInformation | null} the account information for the network, or none if no network exists.
   */
  public static extractAccountInformationForNetwork(
    { networkInfo }: IAccount,
    { genesisHash }: INetwork
  ): IAccountInformation | null {
    return networkInfo[convertGenesisHashToHex(genesisHash)] || null;
  }

  /**
   * Initializes the default account. This also initializes the default account info for each network.
   * @param {IInitializeAccountOptions} options - various options needed to initialize the account.
   * @returns {IAccount} an initialized default account.
   */
  public static initializeDefaultAccount({
    createdAt,
    id,
    name,
    publicKey,
  }: IInitializeAccountOptions): IAccount {
    const createdAtOrNow: number = createdAt || new Date().getTime();

    return {
      createdAt: createdAtOrNow,
      id: id || uuid(),
      networkInfo: networks.reduce<Record<string, IAccountInformation>>(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash)]:
            AccountService.initializeDefaultAccountInformation(name),
        }),
        {}
      ),
      publicKey,
      updatedAt: createdAtOrNow,
    };
  }

  public static initializeDefaultAccountInformation(
    name?: string
  ): IAccountInformation {
    return {
      assetHoldings: [],
      atomicBalance: '0',
      authAddress: null,
      minAtomicBalance: '0',
      name: name || null,
      updatedAt: null,
    };
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that simply creates the account item key from the account ID.
   * @param {string} id - the account ID.
   * @returns {string} the account item key.
   */
  private createAccountItemKey(id: string): string {
    return `${ACCOUNTS_ITEM_KEY_PREFIX}${id}`;
  }

  /**
   * Public functions
   */

  /**
   * Gets the account for a given ID.
   * @param {string} id - the account ID.
   * @returns {Promise<IAccount | null>} the account or null.
   */
  public async getAccountById(id: string): Promise<IAccount | null> {
    return await this.storageManager.getItem(this.createAccountItemKey(id));
  }

  /**
   * Gets the account for a given public key.
   * @param {string} encodedPublicKey - a hexadecimal encoded public key.
   * @returns {Promise<IAccount | null>} the account or null.
   */
  public async getAccountByPublicKey(
    encodedPublicKey: string
  ): Promise<IAccount | null> {
    const accounts: IAccount[] = await this.getAllAccounts();

    return (
      accounts.find(
        (value) =>
          value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
      ) || null
    );
  }

  public async getAllAccounts(): Promise<IAccount[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();
    const accounts: IAccount[] = Object.keys(items).reduce<IAccount[]>(
      (acc, key) =>
        key.startsWith(ACCOUNTS_ITEM_KEY_PREFIX)
          ? [...acc, items[key] as IAccount]
          : acc,
      []
    );

    return accounts.map((account) => ({
      ...account,
      // if there are new networks in the config, retrieve the default network
      networkInfo: networks.reduce<Record<string, IAccountInformation>>(
        (acc, { genesisHash }) => {
          const encodedGenesisHash: string =
            convertGenesisHashToHex(genesisHash).toUpperCase();
          const accountInformation: IAccountInformation | null =
            account.networkInfo[encodedGenesisHash] || null;

          return {
            ...acc,
            ...(accountInformation
              ? {
                  [encodedGenesisHash]: accountInformation,
                }
              : {
                  [encodedGenesisHash]:
                    AccountService.initializeDefaultAccountInformation(),
                }),
          };
        },
        {}
      ),
    }));
  }

  /**
   * Removes an account by its ID.
   * @param {string} id - the account ID.
   */
  public async removeAccountById(id: string): Promise<void> {
    await this.storageManager.remove(this.createAccountItemKey(id));
  }

  public async saveAccounts(accounts: IAccount[]): Promise<IAccount[]> {
    await this.storageManager.setItems(
      accounts.reduce(
        (acc, value) => ({
          ...acc,
          [this.createAccountItemKey(value.id)]: value,
        }),
        {}
      )
    );

    return accounts;
  }
}
