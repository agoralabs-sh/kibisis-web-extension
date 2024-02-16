import { Transaction } from 'algosdk';
import { Dispatch, SetStateAction } from 'react';

interface IMultipleTransactionsContextValue {
  moreDetailsTransactions: Transaction[] | null;
  setMoreDetailsTransactions: Dispatch<SetStateAction<Transaction[] | null>>;
}

export default IMultipleTransactionsContextValue;
