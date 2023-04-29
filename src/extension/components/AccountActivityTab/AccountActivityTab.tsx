import {
  HStack,
  Skeleton,
  Spacer,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { FC, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import EmptyState from '@extension/components/EmptyState';
import TransactionItem from '@extension/components/TransactionItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Features
import {
  IAccountTransaction,
  updateAccountTransactionsThunk,
} from '@extension/features/transactions';

// Selectors
import { useSelectAccountTransactionByAccountId } from '@extension/selectors';

// Types
import { IAccount, IAppThunkDispatch, INetwork } from '@extension/types';

interface IProps {
  account: IAccount;
  network: INetwork;
}

const AccountActivityTab: FC<IProps> = ({ account, network }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accountTransaction: IAccountTransaction | null =
    useSelectAccountTransactionByAccountId(account.id);
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (accountTransaction) {
      nodes = accountTransaction.transactions.map((value) => (
        <TransactionItem
          account={account}
          key={nanoid()}
          network={network}
          transaction={value}
        />
      ));

      // if the account transaction is fetching some more transactions, append a few loading skeletons
      if (accountTransaction.fetching) {
        nodes = [
          ...nodes,
          ...Array.from({ length: 3 }, () => (
            <HStack key={nanoid()} m={0} p={0} spacing={2} w="full">
              <Skeleton>
                <Text color="gray.500" fontSize="sm" maxW={175} noOfLines={1}>
                  {t<string>('headings.transaction', {
                    context: TransactionTypeEnum,
                  })}
                </Text>
              </Skeleton>
            </HStack>
          )),
        ];
      }
    }

    return nodes.length > 0 ? (
      nodes
    ) : (
      <>
        {/*empty state*/}
        <Spacer />
        <EmptyState text={t<string>('headings.noTransactionsFound')} />
        <Spacer />
      </>
    );
  };

  useEffect(() => {
    if (!accountTransaction || accountTransaction.transactions.length <= 0) {
      dispatch(updateAccountTransactionsThunk(account.id));
    }
  }, []);

  return (
    <TabPanel
      flexGrow={1}
      m={0}
      p={0}
      overflowY="scroll"
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        {renderContent()}
      </VStack>
    </TabPanel>
  );
};

export default AccountActivityTab;
