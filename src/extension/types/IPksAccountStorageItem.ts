interface IPksAccountStorageItem {
  createdAt: number;
  encryptedPrivateKey: string;
  id: string;
  name: string | null;
  passwordTagId: string;
  publicKey: string;
  updatedAt: number;
}

export default IPksAccountStorageItem;
