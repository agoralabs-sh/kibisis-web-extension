import { useEffect, useState } from 'react';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectActiveAccountTransactions,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// types
import type { ITransactions } from '@extension/types';
import type { IUseTransactionPageState } from './types';

export default function useTransactionPage(
  transactionId: string | null
): IUseTransactionPageState {
  // selectors
  const account = useSelectActiveAccount();
  const accounts = useSelectAccounts();
  const accountTransactions = useSelectActiveAccountTransactions();
  const network = useSelectSettingsSelectedNetwork();
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
    accounts,
    network,
    transaction,
  };
}
