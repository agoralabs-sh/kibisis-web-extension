// enums
import { EncryptionMethodEnum } from '@extension/enums';

// types
import IPasskeyEncryptionCredentials from './IPasskeyEncryptionCredentials';
import IPasswordEncryptionCredentials from './IPasswordEncryptionCredentials';

type TEncryptionCredentials =
  | IPasskeyEncryptionCredentials
  | IPasswordEncryptionCredentials
  | {
      type: EncryptionMethodEnum.Unencrypted;
    };

export default TEncryptionCredentials;
