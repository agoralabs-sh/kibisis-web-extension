// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Ed21559KeyPair} keyPair - an Ed21559 key pair.
 * @property {string} password - the password used to encrypt the private key.
 * @property {PasswordService} passwordService - [optional] a password service to use, if omitted a new one is created.
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 */
interface IOptions extends IBaseOptions {
  keyPair: Ed21559KeyPair;
  password: string;
  passwordService?: PasswordService;
  privateKeyService?: PrivateKeyService;
}

export default IOptions;
