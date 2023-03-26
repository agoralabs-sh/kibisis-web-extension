interface IAccount {
  address: string;
  atomicBalance: string;
  authAddress: string | null;
  minAtomicBalance: string;
  name: string | null;
}

export default IAccount;
