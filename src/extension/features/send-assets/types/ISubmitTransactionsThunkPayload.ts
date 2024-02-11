import { Transaction } from 'algosdk';

interface ISubmitTransactionsThunkPayload {
  password: string;
  transactions: Transaction[];
}

export default ISubmitTransactionsThunkPayload;
