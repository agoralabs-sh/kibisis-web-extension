interface IBaseTransaction {
  completedAt: number | null; // in milliseconds
  fee: string;
  groupId: string | null;
  id: string | null;
  note: string | null;
  sender: string;
}

export default IBaseTransaction;
