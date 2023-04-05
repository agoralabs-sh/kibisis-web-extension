interface IAccount {
  address: string;
  atomicBalance: string;
  authAddress: string | null;
  id: string;
  minAtomicBalance: string;
  name: string | null;
  updatedAt: number | null;
}

export default IAccount;
