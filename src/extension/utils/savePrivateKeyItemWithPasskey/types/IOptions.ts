// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material used to derive the private key.
 * @property {Ed21559KeyPair} keyPair - an Ed21559 key pair.
 * @property {PasskeyService} passkeyService - [optional] a passkey service to use, if omitted a new one is created.
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 */
interface IOptions extends IBaseOptions {
  inputKeyMaterial: Uint8Array;
  keyPair: Ed21559KeyPair;
  passkeyService?: PasskeyService;
  privateKeyService?: PrivateKeyService;
}

export default IOptions;
