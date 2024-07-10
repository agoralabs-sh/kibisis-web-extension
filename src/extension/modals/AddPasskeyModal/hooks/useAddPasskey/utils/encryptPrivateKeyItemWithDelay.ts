// enums
import { EncryptionMethodEnum } from '@extension/enums';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

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
  const _functionName = 'encryptPrivateKeyItemWithDelay';

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
          inputKeyMaterial,
          passkey,
          logger,
        }); // re-encrypt the private key with the new password
      } catch (error) {
        return reject(error);
      }

      return resolve({
        ...privateKeyItem,
        encryptedPrivateKey: PrivateKeyService.encode(reEncryptedPrivateKey),
        encryptionID: passkey.id,
        encryptionMethod: EncryptionMethodEnum.Passkey,
        updatedAt: new Date().getTime(),
        version,
      });
    }, delay);
  });
}
