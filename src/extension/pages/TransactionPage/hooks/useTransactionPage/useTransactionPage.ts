import { useEffect, useState } from 'react';

// selectors
import {
  useSelectActiveAccount,
  useSelectActiveAccountTransactions,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// types
import type {
  IAccount,
  IAccountTransactions,
  INetwork,
  ITransactions,
} from '@extension/types';
import type { IUseTransactionPageState } from './types';

export default function useTransactionPage(
  transactionId: string | null
): IUseTransactionPageState {
  // selectors
  const account: IAccount | null = useSelectActiveAccount();
  const accountTransactions: IAccountTransactions | null =
    useSelectActiveAccountTransactions();
  const network: INetwork | null = useSelectSelectedNetwork();
  // state
  const [transaction, setTransaction] = useState<ITransactions | null>(null);

  // when the account has been found, and we have the selected network, get the account transaction
  useEffect(() => {
    let selectedTransaction: ITransactions | null;

    if (accountTransactions) {
      selectedTransaction =
        accountTransactions.transactions.find(
          (value) => value.id === transactionId
        ) || null;

      setTransaction(selectedTransaction);
    }
  }, [accountTransactions]);

  return {
    account,
    network,
    transaction,
  };
}
