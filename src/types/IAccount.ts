interface IAccount {
  address: string;
  atomicBalance: string;
  authAddress: string | null;
  id: string;
  minAtomicBalance: string;
  name: string | null;
}

export default IAccount;
