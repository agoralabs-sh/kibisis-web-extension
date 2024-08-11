// types
import type { IBaseOptions } from '@common/types';
import type {
  IPasskeyEncryptionCredentials,
  IPasswordEncryptionCredentials,
  IPrivateKey,
} from '@extension/types';

interface IUpgradeOptions extends IBaseOptions {
  encryptionCredentials:
    | IPasskeyEncryptionCredentials
    | IPasswordEncryptionCredentials;
  privateKeyItem: IPrivateKey;
}

export default IUpgradeOptions;
