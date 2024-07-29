// enums
import { EncryptionMethodEnum } from '@extension/enums';

// types
import type { IPasskeyCredential } from '@extension/types';

interface IPasskeyEncryptionCredentials {
  inputKeyMaterial: Uint8Array;
  passkey: IPasskeyCredential;
  type: EncryptionMethodEnum.Passkey;
}

export default IPasskeyEncryptionCredentials;
