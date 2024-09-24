// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {string} password - the password used to encrypt the private key.
 * @property {PasswordTagRepository} passwordTagRepository - [optional] a password tag repository to use, if omitted a
 * new one is created.
 * @property {PrivateKeyRepository} privateKeyRepository - [optional] a private key repository to use, if omitted a new
 * one is created.
 * @property {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
 */
interface IOptions extends IBaseOptions {
  password: string;
  passwordTagRepository?: PasswordTagRepository;
  privateKeyRepository?: PrivateKeyRepository;
  publicKey: Uint8Array | string;
}

export default IOptions;
