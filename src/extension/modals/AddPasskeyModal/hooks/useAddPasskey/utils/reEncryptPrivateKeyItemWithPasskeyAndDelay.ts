// services
import PasskeyService from '@extension/services/PasskeyService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';
import type { IReEncryptPrivateKeyItemWithPasskeyAndDelayOptions } from '../types';

export default async function reEncryptPrivateKeyItemWithPasskeyAndDelay({
  delay = 0,
  deviceID,
  inputKeyMaterial,
  logger,
  passkey,
  password,
  privateKeyItem,
}: IReEncryptPrivateKeyItemWithPasskeyAndDelayOptions): Promise<IPrivateKey> {
  const _functionName = 'reEncryptPrivateKeyItemWithPasskeyAndDelay';

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let decryptedPrivateKey: Uint8Array;
      let reEncryptedPrivateKey: Uint8Array;
      let version: number = privateKeyItem.version;

      try {
        decryptedPrivateKey = await PasswordService.decryptBytes({
          data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
          logger,
          password,
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

        reEncryptedPrivateKey = await PasskeyService.encryptBytes({
          bytes: decryptedPrivateKey,
          deviceID,
          inputKeyMaterial,
          initializationVector: PasskeyService.decode(
            passkey.initializationVector
          ),
          logger,
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
