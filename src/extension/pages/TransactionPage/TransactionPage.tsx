import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// Components
import PageHeader from '@extension/components/PageHeader';
import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetDestroyTransactionContent from './AssetDestroyTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import LoadingTransactionContent from './LoadingTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Hooks
import useTransactionPage from './hooks/useTransactionPage';

// Utils
import { TransactionTypeEnum } from '@extension/enums';

const TransactionPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { address, transactionId } = useParams();
  // hooks
  const { account, accountInformation, network, transaction } =
    useTransactionPage({
      address: address || null,
      transactionId: transactionId || null,
      onError: () =>
        navigate(ACCOUNTS_ROUTE, {
          replace: true,
        }),
    });
  const renderContent = () => {
    if (!account || !network || !transaction) {
      return <LoadingTransactionContent />;
    }

    switch (transaction.type) {
      case TransactionTypeEnum.ApplicationClearState:
      case TransactionTypeEnum.ApplicationCloseOut:
      case TransactionTypeEnum.ApplicationCreate:
      case TransactionTypeEnum.ApplicationDelete:
      case TransactionTypeEnum.ApplicationNoOp:
      case TransactionTypeEnum.ApplicationOptIn:
      case TransactionTypeEnum.ApplicationUpdate:
        return (
          <ApplicationTransactionContent
            account={account}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetConfig:
        return (
          <AssetConfigTransactionContent
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetCreate:
        return (
          <AssetCreateTransactionContent
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetDestroy:
        return (
          <AssetDestroyTransactionContent
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetFreeze:
      case TransactionTypeEnum.AssetUnfreeze:
        return (
          <AssetFreezeTransactionContent
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetTransfer:
        return (
          <AssetTransferTransactionContent
            account={account}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.Payment:
        return (
          <PaymentTransactionContent
            account={account}
            network={network}
            transaction={transaction}
          />
        );
      default:
        return null;
    }
  };
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!address || !transactionId) {
      return reset();
    }
  }, []);

  if (!transaction) {
    return <LoadingTransactionContent />;
  }

  return (
    <>
      <PageHeader
        title={t<string>('headings.transaction', { context: transaction.type })}
      />
      {renderContent()}
    </>
  );
};

export default TransactionPage;
