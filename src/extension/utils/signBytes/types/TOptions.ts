// types
import type { IBaseOptions } from '@common/types';
import type { TEncryptionCredentials } from '@extension/types';

/**
 * @property {Uint8Array} bytes - the bytes to be signed.
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {Uint8Array} publicKey - the public key of the signer.
 */
interface IOptions extends IBaseOptions {
  bytes: Uint8Array;
  publicKey: Uint8Array;
}

type TOptions = IOptions & TEncryptionCredentials;

export default TOptions;
