// types
import type { IPasskeyCredential } from '@extension/types';

/**
 * @property {string} deviceID - the device ID.
 * @property {IPasskeyCredential} passkey - the passkey credential to remove.
 * @property {string} password - the password used to encrypt the private keys.
 */
interface IRemovePasskeyActionOptions {
  deviceID: string;
  passkey: IPasskeyCredential;
  password: string;
}

export default IRemovePasskeyActionOptions;
