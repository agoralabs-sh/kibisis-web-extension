interface ICreatePrivateKeyOptions {
  encryptedPrivateKey: Uint8Array;
  passwordTagId: string;
  publicKey: Uint8Array;
}

export default ICreatePrivateKeyOptions;
