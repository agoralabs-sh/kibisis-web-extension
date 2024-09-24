// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {PrivateKeyRepository} privateKeyRepository - [optional] a private key repository to use, if omitted a new
 * one is created.
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  privateKeyRepository?: PrivateKeyRepository;
  publicKey: Uint8Array | string;
}

export default IOptions;
