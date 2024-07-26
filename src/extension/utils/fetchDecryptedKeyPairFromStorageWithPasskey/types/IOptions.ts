// services
import PasskeyService from '@extension/services/PasskeyService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material to derive the encryption key.
 * @property {PasskeyService} passkeyService - [optional] a passkey service to use, if omitted a new one is created.
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  inputKeyMaterial: Uint8Array;
  passkeyService?: PasskeyService;
  privateKeyService?: PrivateKeyService;
  publicKey: Uint8Array | string;
}

export default IOptions;
