// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material used to derive the private key.
 * @property {Ed21559KeyPair} keyPair - an Ed21559 key pair.
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 * @property {boolean} saveUnencryptedPrivateKey - [optional] if true, the unencrypted private key is saved. This is
 * used when the credentials lock is active. Defaults to false.
 */
interface ISavePrivateKeyItemBaseOptions extends IBaseOptions {
  keyPair: Ed21559KeyPair;
  privateKeyService?: PrivateKeyService;
  saveUnencryptedPrivateKey?: boolean;
}

export default ISavePrivateKeyItemBaseOptions;
