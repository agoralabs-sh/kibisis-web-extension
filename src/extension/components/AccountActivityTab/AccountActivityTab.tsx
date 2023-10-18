import { Box, HStack, Skeleton, Spacer, Text, VStack } from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { FC, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import EmptyState from '@extension/components/EmptyState';
import ScrollableTabPanel from '@extension/components/ScrollableTabPanel';
import TransactionItem from '@extension/components/TransactionItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Features
import {
  IAccountTransaction,
  updateAccountTransactionsThunk,
} from '@extension/features/transactions';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Selectors
import { useSelectAccountTransactionByAccountId } from '@extension/selectors';

// Types
import { IAccount, IAppThunkDispatch, INetwork } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

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
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // misc
  const handleScrollEnd = () => {
    if (accountTransaction) {
      if (!accountTransaction.fetching && accountTransaction.next) {
        dispatch(updateAccountTransactionsThunk(account.id));
      }
    }
  };
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (accountTransaction) {
      nodes = accountTransaction.transactions.map((value, index) => (
        <TransactionItem
          account={account}
          key={`account-activity-account-transaction-item-${index}`}
          network={network}
          transaction={value}
        />
      ));

      // if the account transaction is fetching some more transactions, append a few loading skeletons`
      if (accountTransaction.fetching) {
        nodes = [
          ...nodes,
          ...Array.from({ length: 3 }, (_, index) => (
            <Box
              key={`account-activity-account-transaction-fetching-item-${index}`}
              px={3}
              py={2}
              w="full"
            >
              <VStack
                alignItems="flex-start"
                justifyContent="center"
                spacing={2}
                w="full"
              >
                <Skeleton>
                  <Text color={defaultTextColor} fontSize="sm">
                    {t<string>('headings.transaction', {
                      context: TransactionTypeEnum.ApplicationNoOp,
                    })}
                  </Text>
                </Skeleton>

                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  w="full"
                >
                  <Skeleton>
                    <Text color={defaultTextColor} fontSize="xs">
                      {ellipseAddress(generateAccount().addr, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </Skeleton>

                  <Skeleton>
                    <Text color={defaultTextColor} fontSize="xs">
                      {new Date().toLocaleString()}
                    </Text>
                  </Skeleton>
                </HStack>
              </VStack>
            </Box>
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
  }, [account]);

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

export default AccountActivityTab;
