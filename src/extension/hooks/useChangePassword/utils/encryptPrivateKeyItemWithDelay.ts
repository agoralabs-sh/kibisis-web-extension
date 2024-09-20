// enums
import { EncryptionMethodEnum } from '@extension/enums';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IPrivateKey } from '@extension/types';
import type { IReEncryptPrivateKeyItemWithDelayOptions } from '../types';

export default async function encryptPrivateKeyItemWithDelay({
  currentPassword,
  delay = 0,
  logger,
  newPassword,
  privateKeyItem,
}: IReEncryptPrivateKeyItemWithDelayOptions): Promise<IPrivateKey> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let decryptedPrivateKey: Uint8Array;
      let reEncryptedPrivateKey: Uint8Array;
      let _privateKeyItem: IPrivateKey;

      try {
        _privateKeyItem = await PrivateKeyRepository.upgrade({
          encryptionCredentials: {
            password: currentPassword,
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
          password: currentPassword,
        }); // decrypt the private key with the current password
        reEncryptedPrivateKey = await PasswordManager.encryptBytes({
          bytes: decryptedPrivateKey,
          logger,
          password: newPassword,
        }); // re-encrypt the private key with the new password
      } catch (error) {
        return reject(error);
      }

      return resolve({
        ..._privateKeyItem,
        encryptedPrivateKey: PrivateKeyRepository.encode(reEncryptedPrivateKey),
      });
    }, delay);
  });
}
