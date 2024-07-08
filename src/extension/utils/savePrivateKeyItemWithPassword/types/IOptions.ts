// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {string} password - the password used to encrypt the private key.
 * @property {PasswordService} passwordService - [optional] a password service to use, if omitted a new one is created.
 * @property {PrivateKeyService} privateKeyService - [optional] a private key service to use, if omitted a new one is
 * created.
 * @property {string} privateKey - the private key.
 */
interface IOptions extends IBaseOptions {
  password: string;
  passwordService?: PasswordService;
  privateKey: Uint8Array;
  privateKeyService?: PrivateKeyService;
}

export default IOptions;
