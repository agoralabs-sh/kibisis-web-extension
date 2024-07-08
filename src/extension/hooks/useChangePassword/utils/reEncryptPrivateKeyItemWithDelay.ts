// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';
import type { IReEncryptPrivateKeyItemWithDelayOptions } from '../types';

export default async function reEncryptPrivateKeyItemWithDelay({
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

      try {
        decryptedPrivateKey = await PasswordService.decryptBytes({
          data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
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
        ...privateKeyItem,
        encryptedPrivateKey: PrivateKeyService.encode(reEncryptedPrivateKey),
        updatedAt: new Date().getTime(),
      });
    }, delay);
  });
}
