import { useEffect, useState } from 'react';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IAccountTransactions,
  INetwork,
  ITransactions,
} from '@extension/types';
import { IUseTransactionPageOptions, IUseTransactionPageState } from './types';

export default function useTransactionPage({
  address,
  onError,
  transactionId,
}: IUseTransactionPageOptions): IUseTransactionPageState {
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const network: INetwork | null = useSelectSelectedNetwork();
  // state
  const [account, setAccount] = useState<IAccount | null>(null);
  const [transaction, setTransaction] = useState<ITransactions | null>(null);

  // 1. when we have the address and accounts, get the account
  useEffect(() => {
    let selectedAccount: IAccount | null;

    if (address && accounts.length > 0) {
      selectedAccount =
        accounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === address
        ) || null;

      // if there is no account, we have an error
      if (!selectedAccount) {
        return onError();
      }

      setAccount(selectedAccount);
    }
  }, [address, accounts]);
  // 2. when the account has been found, and we have the selected network, get the account transaction
  useEffect(() => {
    let accountTransactions: IAccountTransactions | null;
    let selectedTransaction: ITransactions | null;

    if (account && network) {
      accountTransactions = AccountService.extractAccountTransactionsForNetwork(
        account,
        network
      );

      if (accountTransactions) {
        selectedTransaction =
          accountTransactions.transactions.find(
            (value) => value.id === transactionId
          ) || null;

        setTransaction(selectedTransaction);
      }
    }
  }, [account, network]);

  return {
    account,
    network,
    transaction,
  };
}
