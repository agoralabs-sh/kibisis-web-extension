import { sign } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// constants
import { PRIVATE_KEY_ITEM_KEY_PREFIX } from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

// managers
import PasskeyManager from '@extension/managers/PasskeyManager';
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IPrivateKey } from '@extension/types';
import type { ICreateOptions, IUpgradeOptions } from './types';

/**
 * Handles all interactions with the private key item in storage. This does not deal with any encryption/decryption,
 * this is handled in the PasswordService and the PasskeyService.
 *
 * @version 0:
 * * The `encryptedPrivateKey` property is the "secret key" - the private key concentrated to the public key,
 * @version 1:
 * * The `encryptedPrivateKey` property is replaced with the actual private key (seed) rather than the "secret key"
 * (private key concentrated to the public key).
 * * `passwordTagId` has been replaced with `encryptionID` and `encryptionMethod`
 * @version 2:
 * * The new `privateKey` property is the unencrypted private key that is non-nullified when the password lock feature is
 * enabled and not timed out.
 */
export default class PrivateKeyRepository extends BaseRepository {
  // public static variables
  public static readonly latestVersion: number = 2;

  /**
   * public static functions
   */

  /**
   * Convenience function that creates a new private key item.
   * @param {ICreateOptions} options - the raw encrypted private key, the raw public key and the encryption
   * method & ID.
   * @returns {IPrivateKey} an initialized private key item.
   * @public
   * @static
   */
  public static create({
    encryptedPrivateKey,
    encryptionID,
    encryptionMethod,
    privateKey,
    publicKey,
  }: ICreateOptions): IPrivateKey {
    const now = new Date();

    return {
      createdAt: now.getTime(),
      encryptedPrivateKey: PrivateKeyRepository.encode(encryptedPrivateKey),
      encryptionID,
      encryptionMethod,
      id: uuid(),
      privateKey: privateKey ? PrivateKeyRepository.encode(privateKey) : null,
      publicKey: PrivateKeyRepository.encode(publicKey),
      updatedAt: now.getTime(),
      version: PrivateKeyRepository.latestVersion,
    };
  }

  /**
   * Convenience function that extracts the private key (seed) from a "secret key". The secret key is used by tweetnacl
   * and is defined as the 32-byte private key (seed) concatenated to the 32 byte public key.
   * @param {Uint8Array} secretKey - a 64 byte "secret key".
   * @returns {Uint8Array} a 32 byte private key (seed).
   * @public
   * @static
   */
  public static extractPrivateKeyFromSecretKey(
    secretKey: Uint8Array
  ): Uint8Array {
    // if the secret key is <=32-bytes, it is probably not a secret key.
    if (secretKey.byteLength <= sign.seedLength) {
      return secretKey;
    }

    return secretKey.slice(0, sign.seedLength); // get the first 32 bytes, this is the private key (seed)
  }

  public static async upgrade({
    encryptionCredentials,
    logger,
    privateKeyItem,
  }: IUpgradeOptions): Promise<IPrivateKey> {
    let _functionName = 'upgrade';
    let _privateKeyItem: IPrivateKey = privateKeyItem;
    let decryptedPrivateKey: Uint8Array;
    let encryptedPrivateKey: Uint8Array;

    if (privateKeyItem.version >= PrivateKeyRepository.latestVersion) {
      return privateKeyItem;
    }

    logger?.debug(
      `${PrivateKeyRepository.name}#${_functionName}: key "${privateKeyItem.id}" on legacy version "${privateKeyItem.version}"`
    );

    switch (encryptionCredentials.type) {
      case EncryptionMethodEnum.Passkey:
        decryptedPrivateKey = await PasskeyManager.decryptBytes({
          encryptedBytes: PrivateKeyRepository.decode(
            privateKeyItem.encryptedPrivateKey
          ),
          inputKeyMaterial: encryptionCredentials.inputKeyMaterial,
          passkey: encryptionCredentials.passkey,
          logger,
        }); // decrypt the private key with the passkey

        break;
      case EncryptionMethodEnum.Password:
        decryptedPrivateKey = await PasswordManager.decryptBytes({
          bytes: PrivateKeyRepository.decode(
            privateKeyItem.encryptedPrivateKey
          ),
          logger,
          password: encryptionCredentials.password,
        }); // decrypt the private key with the current password

        break;
      default:
        throw new MalformedDataError('no credentials found');
    }

    // un-versioned or version 0 use the "secret key" form - the private key concatenated to the public key
    if (!privateKeyItem.version || privateKeyItem.version <= 0) {
      decryptedPrivateKey =
        PrivateKeyRepository.extractPrivateKeyFromSecretKey(
          decryptedPrivateKey
        );

      switch (encryptionCredentials.type) {
        case EncryptionMethodEnum.Passkey:
          encryptedPrivateKey = await PasskeyManager.encryptBytes({
            bytes: decryptedPrivateKey,
            inputKeyMaterial: encryptionCredentials.inputKeyMaterial,
            passkey: encryptionCredentials.passkey,
            logger,
          }); // re-encrypt the private key with the passkey

          break;
        case EncryptionMethodEnum.Password:
          encryptedPrivateKey = await PasswordManager.encryptBytes({
            bytes: decryptedPrivateKey,
            logger,
            password: encryptionCredentials.password,
          }); // re-encrypt the private key with the current password

          break;
        default:
          throw new MalformedDataError('no credentials found');
      }

      _privateKeyItem = {
        ..._privateKeyItem,
        encryptedPrivateKey: PrivateKeyRepository.encode(encryptedPrivateKey),
        privateKey: _privateKeyItem.privateKey
          ? PrivateKeyRepository.encode(decryptedPrivateKey)
          : null,
      };
    }

    return {
      ..._privateKeyItem,
      version: PrivateKeyRepository.latestVersion, // update to the latest version
    };
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the private key item key from a public key.
   * @param {Uint8Array} publicKey - a hexadecimal encoded public key string.
   * @returns {string} the private key item key.
   * @public
   */
  private _createItemKey(publicKey: string): string {
    return `${PRIVATE_KEY_ITEM_KEY_PREFIX}${publicKey}`;
  }

  /**
   * Sanitizes the private key item, only returning properties that are in the private key item. This function acts as
   * a way to "upgrade" the private keys to handle the changes between versions.
   * @param {IPrivateKey} item - the private key item to sanitize.
   * @returns {IPrivateKey} the sanitized private key item.
   * @private
   */
  private _sanitize({
    createdAt,
    encryptedPrivateKey,
    encryptionID,
    id,
    passwordTagId,
    privateKey,
    publicKey,
    encryptionMethod,
    updatedAt,
    version,
  }: IPrivateKey): IPrivateKey {
    const _version = !version ? 0 : version; // if there is no version, start at zero (legacy)
    const _privateKey = !privateKey ? null : privateKey; // if there is no unencrypted private key (version <2) use null
    let _encryptionID = encryptionID;
    let _encryptionMethod = encryptionMethod;

    // if there is a password tag id, this means it is using the old style, replace it with the new properties (v1+)
    if (
      passwordTagId &&
      (!encryptionID || encryptionMethod !== EncryptionMethodEnum.Passkey)
    ) {
      _encryptionID = passwordTagId;
      _encryptionMethod = EncryptionMethodEnum.Password;
    }

    return {
      createdAt,
      id,
      encryptedPrivateKey,
      encryptionID: _encryptionID,
      encryptionMethod: _encryptionMethod,
      privateKey: _privateKey,
      publicKey,
      updatedAt,
      version: _version,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches all the private keys from storage.
   * @returns {Promise<IPrivateKey[]>} A promise that resolves to all the private keys in storage.
   * @public
   */
  public async fetchAll(): Promise<IPrivateKey[]> {
    return await this._fetchByPrefixKey<IPrivateKey>(
      PRIVATE_KEY_ITEM_KEY_PREFIX
    );
  }

  /**
   * Gets a private key by its public key from storage.
   * @param {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
   * @returns {Promise<IPrivateKey | null>} a promise that resolves to the private key or null.
   * @public
   */
  public async fetchByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<IPrivateKey | null> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? PrivateKeyRepository.encode(publicKey)
        : publicKey;
    const item = await this._fetchByKey<IPrivateKey>(
      this._createItemKey(_publicKey)
    );

    return item ? this._sanitize(item) : null;
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
   * Removes a private key from storage by its public key.
   * @param {Uint8Array | string} publicKey - a raw or hexadecimal encoded public key.
   * @public
   */
  public async removeByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<void> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? PrivateKeyRepository.encode(publicKey)
        : publicKey;

    await this._removeByKeys(this._createItemKey(_publicKey));
  }

  /**
   * Removes all private keys from storage.
   * @public
   */
  public async removeAll(): Promise<void> {
    return await this._removeByKeyPrefix(PRIVATE_KEY_ITEM_KEY_PREFIX);
  }

  /**
   * Saves an array of private keys item to storage. This will overwrite any matching private key items by their public
   * key.
   * @param {IPrivateKey[]} items - the private key items to save.
   * @returns {Promise<IPrivateKey[]>} a promise that resolves to the saved private keys.
   * @public
   */
  public async saveMany(items: IPrivateKey[]): Promise<IPrivateKey[]> {
    const _items = items.map((value) => this._sanitize(value));
    const batches = this._itemize<IPrivateKey>(items);

    // save in batches to avoid exceeding quota
    for (const batch of batches) {
      await this._save<IPrivateKey>(
        batch.reduce<Record<string, IPrivateKey>>(
          (acc, currentValue) => ({
            ...acc,
            [this._createItemKey(currentValue.publicKey)]: {
              ...currentValue,
              updatedAt: new Date().getTime(),
            },
          }),
          {}
        )
      );
    }

    return _items;
  }

  /**
   * Saves a single private key item to storage. This will overwrite a matching private key item by its public key.
   * @param {IPrivateKey} item - The private key item to save.
   * @returns {Promise<IPrivateKey>} A promise that resolves to the saved private key.
   * @public
   */
  public async save(item: IPrivateKey): Promise<IPrivateKey> {
    const _item = this._sanitize(item);

    await this._save<IPrivateKey>({
      [this._createItemKey(_item.publicKey)]: {
        ..._item,
        updatedAt: new Date().getTime(),
      },
    });

    return _item;
  }
}
