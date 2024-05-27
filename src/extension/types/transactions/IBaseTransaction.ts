interface IBaseTransaction {
  authAddr: string | null;
  completedAt: number | null; // in milliseconds
  fee: string;
  genesisHash: string | null;
  groupId: string | null;
  id: string | null;
  note: string | null;
  rekeyTo: string | null;
  sender: string;
}

export default IBaseTransaction;
