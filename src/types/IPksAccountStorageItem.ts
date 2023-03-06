interface IPksAccountStorageItem {
  id: string;
  name: string | null;
  passwordTagId: string;
  publicKey: string;
  encryptedPrivateKey: string;
}

export default IPksAccountStorageItem;
