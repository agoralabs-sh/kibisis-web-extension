interface IPrivateKey {
  createdAt: number;
  encryptedPrivateKey: string;
  id: string;
  passwordTagId: string;
  publicKey: string;
  updatedAt: number;
  version: number;
}

export default IPrivateKey;
