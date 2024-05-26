import { Spacer, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// components
import EmptyState from '@extension/components/EmptyState';
import ScrollableTabPanel from '@extension/components/ScrollableTabPanel';
import TransactionItem, {
  TransactionItemSkeleton,
} from '@extension/components/TransactionItem';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ITransactions } from '@extension/types';
import type { IProps } from './types';

const ActivityTab: FC<IProps> = ({
  account,
  fetching,
  network,
  onScrollEnd,
}) => {
  const { t } = useTranslation();
  // misc
  const transactions: ITransactions[] | null =
    AccountService.extractAccountTransactionsForNetwork(account, network)
      ?.transactions || null;
  // handlers
  const handleScrollEnd = () => onScrollEnd();
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (transactions) {
      nodes = transactions.map((value, index) => (
        <TransactionItem
          account={account}
          key={`activity-tab-item-${index}`}
          network={network}
          transaction={value}
        />
      ));

      // if the account transaction is fetching some more transactions, append a few loading skeletons`
      if (fetching) {
        nodes = [
          ...nodes,
          ...Array.from({ length: 3 }, (_, index) => (
            <TransactionItemSkeleton
              key={`activity-tab-fetching-item-${index}`}
            />
          )),
        ];
      }
    }

    return nodes.length > 0 ? (
      nodes
    ) : (
      <>
        <Spacer />

        {/* empty state */}
        <EmptyState text={t<string>('headings.noTransactionsFound')} />

        <Spacer />
      </>
    );
  };

  return (
    <ScrollableTabPanel
      flexGrow={1}
      m={0}
      onScrollEnd={handleScrollEnd}
      p={0}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      <VStack flexGrow={1} m={0} pb={8} pt={0} px={0} spacing={0} w="full">
        {renderContent()}
      </VStack>
    </ScrollableTabPanel>
  );
};

export default ActivityTab;
