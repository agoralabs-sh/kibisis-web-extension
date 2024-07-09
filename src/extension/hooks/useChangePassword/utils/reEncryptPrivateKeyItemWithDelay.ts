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
  const _functionName = 'reEncryptPrivateKeyItemWithDelay';

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let decryptedPrivateKey: Uint8Array;
      let reEncryptedPrivateKey: Uint8Array;
      let version: number = privateKeyItem.version;

      try {
        decryptedPrivateKey = await PasswordService.decryptBytes({
          data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
          logger,
          password: currentPassword,
        }); // decrypt the private key with the current password

        // if the saved private key is a legacy item, it is using the "secret key" form - the private key concatenated to the public key
        if (privateKeyItem.version <= 0) {
          logger?.debug(
            `${_functionName}: key "${privateKeyItem}" on legacy version "${privateKeyItem.version}", updating`
          );

          decryptedPrivateKey =
            PrivateKeyService.extractPrivateKeyFromSecretKey(
              decryptedPrivateKey
            );
          version = PrivateKeyService.latestVersion; // update to the latest version
        }

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
        version,
      });
    }, delay);
  });
}
