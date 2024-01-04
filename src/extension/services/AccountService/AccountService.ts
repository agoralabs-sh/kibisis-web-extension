import { decode as decodeAsHex, encode as encodeHex } from '@stablelib/hex';
import { decodeAddress, encodeAddress } from 'algosdk';
import { v4 as uuid } from 'uuid';

// config
import { networks } from '@extension/config';

// constants
import { ACCOUNTS_ITEM_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// services
import StorageManager from '../StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IAccountTransactions,
  IInitializeAccountOptions,
  INetwork,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export interface ISaveAccountsOptions {
  saveTransactions?: boolean;
}

export default class AccountService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * public static functions
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
   * Convenience function that extracts the account information for a given network.
   * @param {IAccount} account - the account to get the account information from.
   * @param {INetwork} network - the network to look for.
   * @returns {IAccountInformation | null} the account information for the network, or none if no network exists.
   */
  public static extractAccountInformationForNetwork(
    { networkInformation }: IAccount,
    { genesisHash }: INetwork
  ): IAccountInformation | null {
    const accountInformation: IAccountInformation | null =
      networkInformation[convertGenesisHashToHex(genesisHash).toUpperCase()];

    if (!accountInformation) {
      return null;
    }

    return {
      ...AccountService.initializeDefaultAccountInformation(), // ensure any new items are initialized
      ...accountInformation,
    };
  }

  /**
   * Convenience function that extracts the account transactions for a given network.
   * @param {IAccount} account - the account to get the account transactions from.
   * @param {INetwork} network - the network to look for.
   * @returns {IAccountInformation | null} the account transactions for the network, or none if no network exists.
   */
  public static extractAccountTransactionsForNetwork(
    { networkTransactions }: IAccount,
    { genesisHash }: INetwork
  ): IAccountTransactions | null {
    return (
      networkTransactions[convertGenesisHashToHex(genesisHash).toUpperCase()] ||
      null
    );
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
      name: name || null,
      networkInformation: networks.reduce<Record<string, IAccountInformation>>(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash).toUpperCase()]:
            AccountService.initializeDefaultAccountInformation(),
        }),
        {}
      ),
      networkTransactions: networks.reduce<
        Record<string, IAccountTransactions>
      >(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash).toUpperCase()]:
            AccountService.initializeDefaultAccountTransactions(),
        }),
        {}
      ),
      publicKey,
      updatedAt: createdAtOrNow,
    };
  }

  public static initializeDefaultAccountInformation(): IAccountInformation {
    return {
      arc200AssetHoldings: [],
      atomicBalance: '0',
      authAddress: null,
      minAtomicBalance: '0',
      standardAssetHoldings: [],
      updatedAt: null,
    };
  }

  public static initializeDefaultAccountTransactions(): IAccountTransactions {
    return {
      next: null,
      transactions: [],
    };
  }

  /**
   * private functions
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
   * Sanitizes the account, only returning properties that are in the account object.
   * @param {IAccount} account - the account object to sanitize.
   * @returns {IAccount} the sanitized account object.
   * @private
   */
  private sanitizeAccount(account: IAccount): IAccount {
    return {
      createdAt: account.createdAt,
      id: account.id,
      name: account.name,
      networkInformation: Object.keys(account.networkInformation).reduce<
        Record<string, IAccountInformation>
      >(
        (acc, value) => ({
          ...acc,
          [value]: this.sanitizeAccountInformation(
            account.networkInformation[value]
          ),
        }),
        {}
      ),
      networkTransactions: Object.keys(account.networkTransactions).reduce<
        Record<string, IAccountTransactions>
      >(
        (acc, value) => ({
          ...acc,
          [value]: this.sanitizeAccountTransactions(
            account.networkTransactions[value]
          ),
        }),
        {}
      ),
      publicKey: account.publicKey,
      updatedAt: account.updatedAt,
    };
  }

  /**
   * Sanitizes the account information, only returning properties that are in the account information object.
   * @param {IAccountInformation} accountInformation - the account information object to sanitize.
   * @returns {IAccountInformation} the sanitized account information object.
   * @private
   */
  private sanitizeAccountInformation(
    accountInformation: IAccountInformation
  ): IAccountInformation {
    return {
      arc200AssetHoldings: accountInformation.arc200AssetHoldings,
      atomicBalance: accountInformation.atomicBalance,
      authAddress: accountInformation.authAddress,
      minAtomicBalance: accountInformation.minAtomicBalance,
      standardAssetHoldings: accountInformation.standardAssetHoldings,
      updatedAt: accountInformation.updatedAt,
    };
  }

  /**
   * Sanitizes the account transactions, only returning properties that are in the account transactions object.
   * @param {IAccountTransactions} accountTransactions - the account transactions object to sanitize.
   * @returns {IAccountTransactions} the sanitized account transactions object.
   * @private
   */
  private sanitizeAccountTransactions(
    accountTransactions: IAccountTransactions
  ): IAccountTransactions {
    return {
      next: accountTransactions.next,
      transactions: accountTransactions.transactions,
    };
  }

  /**
   * public functions
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
      // if there are new networks in the config, create default account information and transactions for these new networks
      networkInformation: networks.reduce<Record<string, IAccountInformation>>(
        (acc, { genesisHash }) => {
          const encodedGenesisHash: string =
            convertGenesisHashToHex(genesisHash).toUpperCase();
          const accountInformation: IAccountInformation = {
            ...AccountService.initializeDefaultAccountInformation(), // initialize with any new values
            ...account.networkInformation[encodedGenesisHash],
          };

          return {
            ...acc,
            [encodedGenesisHash]: {
              ...AccountService.initializeDefaultAccountInformation(),
              ...(accountInformation && {
                ...accountInformation,
                arc200AssetHoldings: accountInformation.arc200AssetHoldings.map(
                  (value) => ({
                    ...value,
                    type: AssetTypeEnum.Arc200,
                  })
                ),
                standardAssetHoldings:
                  accountInformation.standardAssetHoldings.map((value) => ({
                    ...value,
                    type: AssetTypeEnum.Standard,
                  })),
              }),
            },
          };
        },
        {}
      ),
      networkTransactions: networks.reduce<
        Record<string, IAccountTransactions>
      >((acc, { genesisHash }) => {
        const encodedGenesisHash: string =
          convertGenesisHashToHex(genesisHash).toUpperCase();
        const accountTransactions: IAccountTransactions = {
          ...AccountService.initializeDefaultAccountTransactions(), // initialize with any new values
          ...account.networkTransactions[encodedGenesisHash],
        };

        return {
          ...acc,
          [encodedGenesisHash]: {
            ...AccountService.initializeDefaultAccountTransactions(),
            ...accountTransactions,
          },
        };
      }, {}),
    }));
  }

  /**
   * Removes an account by its ID.
   * @param {string} id - the account ID.
   */
  public async removeAccountById(id: string): Promise<void> {
    await this.storageManager.remove(this.createAccountItemKey(id));
  }

  /**
   * Convenience function that saves accounts to local storage. Each network's account information is stored, but each
   * network's account transactions are only stored, if the `options.saveTransactions` is set to true, but by default
   * no transaction data is saved.
   *
   * This function will overwrite any previous account data indexed by the account ID.
   * @param {IAccount[]} accounts - the list of accounts to save.
   * @param {ISaveAccountsOptions} options - [optional] various options to affect how the data is saved.
   * @returns {IAccount[]} the accounts that were passed in the argument.
   * @todo cache the first 100 transactions
   */
  public async saveAccounts(
    accounts: IAccount[],
    { saveTransactions }: ISaveAccountsOptions = { saveTransactions: false }
  ): Promise<IAccount[]> {
    await this.storageManager.setItems(
      accounts.reduce<Record<string, IAccount>>(
        (acc, account) => ({
          ...acc,
          [this.createAccountItemKey(account.id)]: {
            ...this.sanitizeAccount(account),
            // only save transactions if explicitly allowed
            // TODO: cache the first 100
            ...(!saveTransactions && {
              networkTransactions: networks.reduce(
                (acc, { genesisHash }) => ({
                  ...acc,
                  [convertGenesisHashToHex(genesisHash).toUpperCase()]:
                    AccountService.initializeDefaultAccountTransactions(),
                }),
                {}
              ),
            }),
          },
        }),
        {}
      )
    );

    return accounts;
  }
}
