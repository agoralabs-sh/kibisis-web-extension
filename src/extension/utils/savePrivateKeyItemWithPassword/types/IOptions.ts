// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';

// types
import type { ISavePrivateKeyItemBaseOptions } from '@extension/types';

/**
 * @property {string} password - the password used to encrypt the private key.
 * @property {PasswordTagRepository} passwordTagRepository - [optional] a password tag repository to use, if omitted a
 * new one is created.
 */
interface IOptions extends ISavePrivateKeyItemBaseOptions {
  password: string;
  passwordTagRepository?: PasswordTagRepository;
}

export default IOptions;
