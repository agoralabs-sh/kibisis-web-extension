// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  privateKeyService?: PrivateKeyService;
  publicKey: Uint8Array | string;
}

export default IOptions;
