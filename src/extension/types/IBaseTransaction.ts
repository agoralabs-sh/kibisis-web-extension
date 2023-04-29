interface IBaseTransaction {
  fee: string;
  groupId: string | null;
  id: string | null;
  note: string | null;
  sender: string;
}

export default IBaseTransaction;
