// enums
import { EncryptionMethodEnum } from '@extension/enums';

interface IPasswordEncryptionCredentials {
  password: string;
  type: EncryptionMethodEnum.Password;
}

export default IPasswordEncryptionCredentials;
