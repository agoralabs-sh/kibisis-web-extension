import { v4 as uuid } from 'uuid';

// constants
import { HARDWARE_WALLET_ITEM_KEY_PREFIX } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IHardwareWallet } from '@extension/types';
import type { ICreateOptions } from './types';

export default class HardwareWalletRepository extends BaseRepository {
  /**
   * public static functions
   */

  /**
   * Convenience function that creates a new hardware wallet item.
   * @param {ICreateOptions} options - The decoded public key, the network and the account index.
   * @returns {IHardwareWallet} An initialized hardware wallet item.
   * @public
   * @static
   */
  public static create({
    accountIndex,
    network,
    publicKey,
  }: ICreateOptions): IHardwareWallet {
    const now = new Date();

    return {
      accountIndex,
      coinType: network.hdWalletCoinType,
      createdAt: now.getTime(),
      id: uuid(),
      index: 0,
      publicKey: HardwareWalletRepository.encode(publicKey),
    };
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the hardware wallet item key from a public key.
   * @param {Uint8Array} publicKey - a hexadecimal encoded public key string.
   * @returns {string} the hardware wallet item key.
   * @public
   */
  private _createItemKey(publicKey: string): string {
    return `${HARDWARE_WALLET_ITEM_KEY_PREFIX}${publicKey}`;
  }

  /**
   * public functions
   */

  /**
   * Fetches all the hardware wallets from storage.
   * @returns {Promise<IHardwareWallet[]>} A promise that resolves to all the hardware wallets in storage.
   * @public
   */
  public async fetchAll(): Promise<IHardwareWallet[]> {
    return await this._fetchByPrefixKey<IHardwareWallet>(
      HARDWARE_WALLET_ITEM_KEY_PREFIX
    );
  }

  /**
   * Gets a hardware wallet by its public key from storage.
   * @param {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
   * @returns {Promise<IHardwareWallet | null>} a promise that resolves to the hardware wallet or null.
   * @public
   */
  public async fetchByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<IHardwareWallet | null> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? HardwareWalletRepository.encode(publicKey)
        : publicKey;

    return await this._fetchByKey<IHardwareWallet>(
      this._createItemKey(_publicKey)
    );
  }

  /**
   * Gets a list of all the public keys. All returned keys will be hexadecimal encoded strings.
   * @returns {Promise<string[]} a promise that resolves to a list of all the public keys.
   * @public
   */
  public async listPublicKeys(): Promise<string[]> {
    const items = await this.fetchAll();

    return items.map((value) => value.publicKey);
  }

  /**
   * Removes a hardware wallet from storage by its public key.
   * @param {Uint8Array | string} publicKey - a raw or hexadecimal encoded public key.
   * @public
   */
  public async removeByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<void> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? HardwareWalletRepository.encode(publicKey)
        : publicKey;

    await this._removeByKeys(this._createItemKey(_publicKey));
  }

  /**
   * Removes all hardware wallets from storage.
   * @public
   */
  public async removeAll(): Promise<void> {
    return await this._removeByKeyPrefix(HARDWARE_WALLET_ITEM_KEY_PREFIX);
  }

  /**
   * Saves an array of hardware wallets item to storage. This will overwrite any matching hardware wallet items by their public
   * key.
   * @param {IHardwareWallet[]} items - the hardware wallet items to save.
   * @returns {Promise<IHardwareWallet[]>} a promise that resolves to the saved hardware wallets.
   * @public
   */
  public async saveMany(items: IHardwareWallet[]): Promise<IHardwareWallet[]> {
    const batches = this._itemize<IHardwareWallet>(items);

    // save in batches to avoid exceeding quota
    for (const batch of batches) {
      await this._save<IHardwareWallet>(
        batch.reduce<Record<string, IHardwareWallet>>(
          (acc, currentValue) => ({
            ...acc,
            [this._createItemKey(currentValue.publicKey)]: currentValue,
          }),
          {}
        )
      );
    }

    return items;
  }

  /**
   * Saves a single hardware wallet item to storage. This will overwrite a matching private key item by its public key.
   * @param {IHardwareWallet} item - The hardware wallet item to save.
   * @returns {Promise<IHardwareWallet>} A promise that resolves to the saved hardware wallet.
   * @public
   */
  public async save(item: IHardwareWallet): Promise<IHardwareWallet> {
    await this._save<IHardwareWallet>({
      [this._createItemKey(item.publicKey)]: item,
    });

    return item;
  }
}
