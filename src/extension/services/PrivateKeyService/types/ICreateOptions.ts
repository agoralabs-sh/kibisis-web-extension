// enums
import { EncryptionMethodEnum } from '@extension/enums';

interface ICreateOptions {
  encryptedPrivateKey: Uint8Array;
  encryptionID: string;
  encryptionMethod: EncryptionMethodEnum;
  privateKey?: string;
  publicKey: Uint8Array;
}

export default ICreateOptions;
