// services
import PasswordService from '@extension/services/PasswordService';

// types
import type { ISavePrivateKeyItemBaseOptions } from '@extension/types';

/**
 * @property {string} password - the password used to encrypt the private key.
 * @property {PasswordService} passwordService - [optional] a password service to use, if omitted a new one is created.
 */
interface IOptions extends ISavePrivateKeyItemBaseOptions {
  password: string;
  passwordService?: PasswordService;
}

export default IOptions;
