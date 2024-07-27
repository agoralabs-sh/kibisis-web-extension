// enums
import { EncryptionMethodEnum } from '@extension/enums';

/**
 * @property {number} createdAt - the time in milliseconds since the UNIX epoch for when the resource was created.
 * @property {string} encryptedPrivateKey - the hexadecimal encoded encrypted private key.
 * @property {string} encryptionID - the ID of the encryption method. For 'password' encryption, this will be the ID of
 * the saved password tag, for 'passkey' this will be the passkey credential ID.
 * @property {EncryptionMethodEnum} encryptionMethod - the encryption method used to encrypt the private key.
 * @property {string} id - a unique v4 UUID compliant string.
 * @property {string} publicKey - the hexadecimal encoded public key.
 * @property {string | null} privateKey - the unencrypted hexadecimal encoded private key. This will only be decrypted
 * when the password lock enabled and not timed out.
 * @property {number} updatedAt - the time in milliseconds since the UNIX epoch for when the resource was updated.
 * @property {number} version - the version of this resource.
 */
interface IPrivateKey {
  createdAt: number;
  encryptedPrivateKey: string;
  encryptionID: string;
  encryptionMethod: EncryptionMethodEnum;
  id: string;
  privateKey: string | null;
  publicKey: string;
  updatedAt: number;
  version: number;
  /** @deprecated `passwordTagId` no longer in use in favour of `encryptionID` & `method` since v1+ **/
  passwordTagId?: string;
}

export default IPrivateKey;
