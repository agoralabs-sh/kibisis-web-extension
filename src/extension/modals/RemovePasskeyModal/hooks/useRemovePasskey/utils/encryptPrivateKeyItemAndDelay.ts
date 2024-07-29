import browser from 'webextension-polyfill';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type { IEncryptPrivateKeyItemWithDelayOptions } from '../types';

/**
 * Convenience function that decrypts a private key item with the passkey and re-encrypts with the password.
 * @param {IEncryptPrivateKeyItemWithDelayOptions} options - the password, the passkey credential, the input key
 * material to derive a passkey encryption key, the private key item to decrypt/encrypt and an optional delay.
 * @returns {IPrivateKey} a re-encrypted private key item.
 */
export default async function encryptPrivateKeyItemAndDelay({
  delay = 0,
  inputKeyMaterial,
  logger,
  passkey,
  password,
  privateKeyItem,
}: IEncryptPrivateKeyItemWithDelayOptions): Promise<IPrivateKey> {
  const _functionName = 'encryptPrivateKeyItemAndDelay';

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const passwordService = new PasswordService({
        logger,
        passwordTag: browser.runtime.id,
      });
      let _error: string;
      let decryptedPrivateKey: Uint8Array;
      let passwordTagItem: IPasswordTag | null;
      let reEncryptedPrivateKey: Uint8Array;
      let _privateKeyItem: IPrivateKey;

      try {
        _privateKeyItem = await PrivateKeyService.upgrade({
          encryptionCredentials: {
            inputKeyMaterial,
            passkey,
            type: EncryptionMethodEnum.Passkey,
          },
          logger,
          privateKeyItem,
        });
        decryptedPrivateKey = await PasskeyService.decryptBytes({
          encryptedBytes: PrivateKeyService.decode(
            _privateKeyItem.encryptedPrivateKey
          ),
          inputKeyMaterial,
          passkey,
          logger,
        }); // decrypt the private key with the passkey
        reEncryptedPrivateKey = await PasswordService.encryptBytes({
          data: decryptedPrivateKey,
          logger,
          password,
        }); // re-encrypt the private key with the password
        passwordTagItem = await passwordService.fetchFromStorage();

        if (!passwordTagItem) {
          _error = `failed to get password tag from storage, doesn't exist`;

          logger?.error(`${_functionName}: ${_error}`);

          throw new MalformedDataError(_error);
        }
      } catch (error) {
        return reject(error);
      }

      return resolve({
        ..._privateKeyItem,
        encryptedPrivateKey: PrivateKeyService.encode(reEncryptedPrivateKey),
        encryptionID: passwordTagItem.id,
        encryptionMethod: EncryptionMethodEnum.Password,
      });
    }, delay);
  });
}
