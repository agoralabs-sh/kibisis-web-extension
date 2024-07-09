// types
import type { IPasskeyCredential } from '@extension/types';

/**
 * @property {IPasskeyCredential} passkey - the passkey credential.
 * @property {string} password - the password used to encrypt the private keys.
 */
interface IAddPasskeyActionOptions {
  passkey: IPasskeyCredential;
  password: string;
}

export default IAddPasskeyActionOptions;
