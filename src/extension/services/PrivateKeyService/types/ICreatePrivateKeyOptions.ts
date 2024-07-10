// enums
import { EncryptionMethodEnum } from '@extension/enums';

interface ICreatePrivateKeyOptions {
  encryptedPrivateKey: Uint8Array;
  encryptionID: string;
  encryptionMethod: EncryptionMethodEnum;
  publicKey: Uint8Array;
}

export default ICreatePrivateKeyOptions;
