interface IBaseTransaction {
  completedAt: number | null; // in milliseconds
  fee: string;
  genesisHash: string | null;
  groupId: string | null;
  id: string | null;
  note: string | null;
  sender: string;
}

export default IBaseTransaction;
