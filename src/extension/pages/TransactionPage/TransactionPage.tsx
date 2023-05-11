import { VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// Components
import LoadingPage from '@extension/components/LoadingPage';
import PageHeader from '@extension/components/PageHeader';
import LoadingTransactionContent from './LoadingTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// Constants
import { ACCOUNTS_ROUTE, DEFAULT_GAP } from '@extension/constants';

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

  if (!account || !accountInformation || !transaction) {
    return <LoadingPage />;
  }

  return (
    <>
      <PageHeader
        title={t<string>('headings.transaction', { context: transaction.type })}
      />
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        px={DEFAULT_GAP}
        spacing={4}
        w="full"
      >
        {renderContent()}
      </VStack>
    </>
  );
};

export default TransactionPage;
