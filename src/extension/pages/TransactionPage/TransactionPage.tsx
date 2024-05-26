import React, { FC, useEffect } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// components
import AccountReKeyTransactionPage from './AccountReKeyTransactionPage';
import AccountUndoReKeyTransactionPage from './AccountUndoReKeyTransactionPage';
import ApplicationTransactionPage from './ApplicationTransactionPage';
import ARC0200AssetTransferTransactionPage from './ARC0200AssetTransferTransactionPage';
import AssetConfigTransactionPage from './AssetConfigTransactionPage';
import AssetCreateTransactionPage from './AssetCreateTransactionPage';
import AssetDestroyTransactionPage from './AssetDestroyTransactionPage';
import AssetFreezeTransactionPage from './AssetFreezeTransactionPage';
import AssetTransferTransactionPage from './AssetTransferTransactionPage';
import LoadingTransactionPage from './LoadingTransactionPage';
import PaymentTransactionPage from './PaymentTransactionPage';

// constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useTransactionPage from './hooks/useTransactionPage';

// selectors
import { useSelectARC0200AssetsBySelectedNetwork } from '@extension/selectors';

// types
import type { IARC0200AssetTransferTransaction } from '@extension/types';

// utils
import parseARC0200Transaction from '@extension/utils/parseARC0200Transaction';

const TransactionPage: FC = () => {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  // hooks
  const { account, network, transaction } = useTransactionPage(
    transactionId || null
  );
  // misc
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  // renders
  let arc0200Transaction: IARC0200AssetTransferTransaction | null;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!transactionId) {
      return reset();
    }
  }, []);

  if (!account || !network || !transaction) {
    return <LoadingTransactionPage />;
  }

  switch (transaction.type) {
    case TransactionTypeEnum.AccountUndoReKey:
      return (
        <AccountUndoReKeyTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AccountReKey:
      return (
        <AccountReKeyTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.ApplicationClearState:
    case TransactionTypeEnum.ApplicationCloseOut:
    case TransactionTypeEnum.ApplicationCreate:
    case TransactionTypeEnum.ApplicationDelete:
    case TransactionTypeEnum.ApplicationOptIn:
    case TransactionTypeEnum.ApplicationUpdate:
      return (
        <ApplicationTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.ApplicationNoOp:
      if (arc0200Assets.find(({ id }) => id === transaction.applicationId)) {
        arc0200Transaction = parseARC0200Transaction(transaction);

        if (
          arc0200Transaction?.type === TransactionTypeEnum.ARC0200AssetTransfer
        ) {
          return (
            <ARC0200AssetTransferTransactionPage
              account={account}
              network={network}
              transaction={arc0200Transaction}
            />
          );
        }
      }

      return (
        <ApplicationTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AssetConfig:
      return (
        <AssetConfigTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AssetCreate:
      return (
        <AssetCreateTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AssetDestroy:
      return (
        <AssetDestroyTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AssetFreeze:
    case TransactionTypeEnum.AssetUnfreeze:
      return (
        <AssetFreezeTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.AssetTransfer:
      return (
        <AssetTransferTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    case TransactionTypeEnum.Payment:
      return (
        <PaymentTransactionPage
          account={account}
          network={network}
          transaction={transaction}
        />
      );
    default:
      return null;
  }
};

export default TransactionPage;
