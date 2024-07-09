// types
import type { IBaseOptions } from '@common/types';
import type { IPasskeyCredential, IPrivateKey } from '@extension/types';

interface IEncryptPrivateKeyItemWithDelayOptions extends IBaseOptions {
  delay?: number;
  deviceID: string;
  inputKeyMaterial: Uint8Array;
  passkey: IPasskeyCredential;
  password: string;
  privateKeyItem: IPrivateKey;
}

export default IEncryptPrivateKeyItemWithDelayOptions;
