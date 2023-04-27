interface IPrivateKey {
  createdAt: number;
  encryptedPrivateKey: string;
  id: string;
  passwordTagId: string;
  publicKey: string;
  updatedAt: number;
}

export default IPrivateKey;
