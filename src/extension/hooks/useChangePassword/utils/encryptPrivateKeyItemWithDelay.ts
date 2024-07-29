// enums
import { EncryptionMethodEnum } from '@extension/enums';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

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
        _privateKeyItem = await PrivateKeyService.upgrade({
          encryptionCredentials: {
            password: currentPassword,
            type: EncryptionMethodEnum.Password,
          },
          logger,
          privateKeyItem,
        });
        decryptedPrivateKey = await PasswordService.decryptBytes({
          data: PrivateKeyService.decode(_privateKeyItem.encryptedPrivateKey),
          logger,
          password: currentPassword,
        }); // decrypt the private key with the current password
        reEncryptedPrivateKey = await PasswordService.encryptBytes({
          data: decryptedPrivateKey,
          logger,
          password: newPassword,
        }); // re-encrypt the private key with the new password
      } catch (error) {
        return reject(error);
      }

      return resolve({
        ..._privateKeyItem,
        encryptedPrivateKey: PrivateKeyService.encode(reEncryptedPrivateKey),
      });
    }, delay);
  });
}
