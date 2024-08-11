// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type { ISavePrivateKeyItemBaseOptions } from '@extension/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material used to derive the private key.
 * @property {PasskeyService} passkeyService - [optional] a passkey service to use, if omitted a new one is created.
 */
interface IOptions extends ISavePrivateKeyItemBaseOptions {
  inputKeyMaterial: Uint8Array;
  passkeyService?: PasskeyService;
}

export default IOptions;
