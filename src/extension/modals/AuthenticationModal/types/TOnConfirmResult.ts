// enums
import { EncryptionMethodEnum } from '@extension/enums';

type TOnConfirmResult =
  | {
      password: string;
      type: EncryptionMethodEnum.Password;
    }
  | {
      inputKeyMaterial: Uint8Array;
      type: EncryptionMethodEnum.Passkey;
    };

export default TOnConfirmResult;
