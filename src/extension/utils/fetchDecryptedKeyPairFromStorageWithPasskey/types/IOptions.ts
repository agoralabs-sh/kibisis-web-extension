// repositories
import PasskeyCredentialRepository from '@extension/repositories/PasskeyCredentialRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material to derive the encryption key.
 * @property {PasskeyCredentialRepository} passkeyCredentialRepository - [optional] a passkey credential repository to
 * use, if omitted a new one is created.
 * @property {PrivateKeyRepository} privateKeyRepository - [optional] a private key repository to use, if omitted a new
 * one is
 * created.
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  inputKeyMaterial: Uint8Array;
  passkeyCredentialRepository?: PasskeyCredentialRepository;
  privateKeyRepository?: PrivateKeyRepository;
  publicKey: Uint8Array | string;
}

export default IOptions;
