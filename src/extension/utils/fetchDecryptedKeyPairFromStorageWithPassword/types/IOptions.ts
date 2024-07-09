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
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  password: string;
  passwordService?: PasswordService;
  privateKeyService?: PrivateKeyService;
  publicKey: Uint8Array | string;
}

export default IOptions;
