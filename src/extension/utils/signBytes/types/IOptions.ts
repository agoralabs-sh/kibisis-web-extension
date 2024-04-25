// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Uint8Array} bytes - the bytes to be signed.
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {Uint8Array} publicKey - the public key of the signer.
 */
interface IOptions extends IBaseOptions {
  bytes: Uint8Array;
  password: string;
  publicKey: Uint8Array;
}

export default IOptions;
