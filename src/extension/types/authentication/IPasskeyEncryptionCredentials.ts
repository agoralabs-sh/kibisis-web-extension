// enums
import { EncryptionMethodEnum } from '@extension/enums';

interface IPasskeyEncryptionCredentials {
  inputKeyMaterial: Uint8Array;
  type: EncryptionMethodEnum.Passkey;
}

export default IPasskeyEncryptionCredentials;
