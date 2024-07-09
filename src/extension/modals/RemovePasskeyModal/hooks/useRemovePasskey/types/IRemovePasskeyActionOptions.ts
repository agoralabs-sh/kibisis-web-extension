// types
import type { IPasskeyCredential } from '@extension/types';

/**
 * @property {IPasskeyCredential} passkey - the passkey credential to remove.
 * @property {string} password - the password used to encrypt the private keys.
 */
interface IRemovePasskeyActionOptions {
  passkey: IPasskeyCredential;
  password: string;
}

export default IRemovePasskeyActionOptions;
