// enums
import { EncryptionMethodEnum } from '@extension/enums';

// managers
import PasskeyManager from '@extension/managers/PasskeyManager';
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IPrivateKey } from '@extension/types';
import type { IEncryptPrivateKeyItemWithDelayOptions } from '../types';

/**
 * Convenience function that decrypts a private key item with the password and re-encrypts with the passkey.
 * @param {IEncryptPrivateKeyItemWithDelayOptions} options - the password, the passkey credential, the input key
 * material to derive a passkey encryption key, the private key item to decrypt/encrypt and an optional delay.
 * @returns {IPrivateKey} a re-encrypted private key item.
 */
export default async function encryptPrivateKeyItemWithDelay({
  delay = 0,
  inputKeyMaterial,
  logger,
  passkey,
  password,
  privateKeyItem,
}: IEncryptPrivateKeyItemWithDelayOptions): Promise<IPrivateKey> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let decryptedPrivateKey: Uint8Array;
      let reEncryptedPrivateKey: Uint8Array;
      let _privateKeyItem: IPrivateKey;

      try {
        _privateKeyItem = await PrivateKeyRepository.upgrade({
          encryptionCredentials: {
            password,
            type: EncryptionMethodEnum.Password,
          },
          logger,
          privateKeyItem,
        });
        decryptedPrivateKey = await PasswordManager.decryptBytes({
          bytes: PrivateKeyRepository.decode(
            _privateKeyItem.encryptedPrivateKey
          ),
          logger,
          password,
        }); // decrypt the private key with the current password
        reEncryptedPrivateKey = await PasskeyManager.encryptBytes({
          bytes: decryptedPrivateKey,
          inputKeyMaterial,
          passkey,
          logger,
        }); // re-encrypt the private key with the new password
      } catch (error) {
        return reject(error);
      }

      return resolve({
        ...privateKeyItem,
        encryptedPrivateKey: PrivateKeyRepository.encode(reEncryptedPrivateKey),
        encryptionID: passkey.id,
        encryptionMethod: EncryptionMethodEnum.Passkey,
      });
    }, delay);
  });
}
