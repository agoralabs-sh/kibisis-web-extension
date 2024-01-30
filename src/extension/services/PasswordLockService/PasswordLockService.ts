import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import { v4 as uuid } from 'uuid';
import { Alarms } from 'webextension-polyfill';

// constants
import { PASSWORD_LOCK_ITEM_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type { IPasswordLock } from '@extension/types';
import type { ICreateOptions } from './types';

// utils
import encryptBytes from '@extension/utils/encryptBytes';
import decryptBytes from '@extension/utils/decryptBytes';

export default class PasswordLockService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  // public variables
  public readonly version: number = 0;

  constructor({ logger, storageManager }: ICreateOptions) {
    this.logger = logger || null;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * public functions
   */

  /**
   * Convenience function that simply removes the password lock.
   */
  public async clearPasswordLock(): Promise<void> {
    await this.storageManager.remove(PASSWORD_LOCK_ITEM_KEY);
  }

  /**
   * Gets the encrypted password from storage.
   * @param {Alarms.Alarm} alarm - the alarm used to encrypt the password lock.
   * @returns {string | null} the decrypted password, or null if the password lock is not found or failed to be decrypted.
   */
  public async getPassword(alarm: Alarms.Alarm): Promise<string | null> {
    const _functionName: string = 'getPassword';
    const passwordLock: IPasswordLock | null =
      await this.storageManager.getItem<IPasswordLock>(PASSWORD_LOCK_ITEM_KEY);
    let decryptedPassword: Uint8Array;

    // if there is no password lock, there is no password
    if (!passwordLock) {
      return null;
    }

    try {
      decryptedPassword = await decryptBytes(
        decodeHex(passwordLock.encryptedPasswordLock),
        alarm.scheduledTime.toString(), // the alarm's scheduled time (the "when" parameter when creating the alarm) should have been used as the secret
        {
          ...(this.logger && {
            logger: this.logger,
          }),
        }
      );

      return decodeUtf8(decryptedPassword);
    } catch (error) {
      this.logger?.debug(
        `${PasswordLockService.name}#${_functionName}(): failed to decrypt the password`
      );

      return null;
    }
  }

  /**
   * Saves the password lock to storage. This encrypts the password using the alarm's scheduled time as the encryption
   * secret.
   * @param {string} password - the password to encrypt.
   * @param {Alarms.Alarm} alarm - the alarm used to determine the secret.
   * @returns {IPasswordLock} the encrypted password lock.
   * @throws {EncryptionError} If there was a problem encrypting data.
   */
  public async setPassword(
    password: string,
    alarm: Alarms.Alarm
  ): Promise<IPasswordLock> {
    const _functionName: string = 'setPassword';
    const encryptedPasswordLock: Uint8Array = await encryptBytes(
      encodeUtf8(password),
      alarm.scheduledTime.toString(), // use the alarm's scheduled time (the "when" parameter when creating the alarm)
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    ); // encrypt the password
    const passwordLock: IPasswordLock = {
      encryptedPasswordLock: encodeHex(encryptedPasswordLock), // encode it into hexadecimal
      id: uuid(),
      version: this.version,
    };

    this.logger?.debug(
      `${PasswordLockService.name}#${_functionName}(): saving password lock to storage`
    );

    await this.storageManager.setItems({
      [PASSWORD_LOCK_ITEM_KEY]: passwordLock,
    });

    return passwordLock;
  }
}
