import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// components
import EmptyState from '@extension/components/EmptyState';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TransactionItem, {
  TransactionItemSkeleton,
} from '@extension/components/TransactionItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IProps } from './types';

const ActivityTab: FC<IProps> = ({
  account,
  accounts,
  fetching,
  network,
  onScrollEnd,
}) => {
  const { t } = useTranslation();
  // misc
  const transactions =
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
          accounts={accounts}
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
      <ScrollableContainer
        direction="column"
        m={0}
        onScrollEnd={handleScrollEnd}
        pb={8}
        pt={0}
        px={0}
        spacing={0}
        w="full"
      >
        {nodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/* empty state */}
        <EmptyState text={t<string>('headings.noTransactionsFound')} />

        <Spacer />
      </VStack>
    );
  };

  return (
    <TabPanel
      height={ACCOUNT_PAGE_TAB_CONTENT_HEIGHT}
      m={0}
      p={0}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      {renderContent()}
    </TabPanel>
  );
};

export default ActivityTab;
