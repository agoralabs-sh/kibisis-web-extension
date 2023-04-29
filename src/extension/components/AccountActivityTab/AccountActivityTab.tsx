import {
  Button,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { FC, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import EmptyState from '@extension/components/EmptyState';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Features
import {
  IAccountTransaction,
  updateAccountTransactionsThunk,
} from '@extension/features/transactions';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Selectors
import { useSelectAccountTransactionByAccountId } from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Types
import { IAccount, IAppThunkDispatch } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

interface IProps {
  account: IAccount;
}

const AccountActivityTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accountTransaction: IAccountTransaction | null =
    useSelectAccountTransactionByAccountId(account.id);
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (accountTransaction) {
      nodes = accountTransaction.transactions.map((value) => (
        <Button
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          as={Link}
          borderRadius={0}
          fontSize="md"
          key={nanoid()}
          h={16}
          justifyContent="start"
          pl={3}
          pr={1}
          py={0}
          rightIcon={
            <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
          }
          to={`${ACCOUNTS_ROUTE}/${AccountService.convertPublicKeyToAlgorandAddress(
            account.publicKey
          )}`}
          variant="ghost"
          w="full"
        >
          <HStack m={0} p={0} spacing={2} w="full">
            <Text color={defaultTextColor} fontSize="sm">
              {t<string>('headings.transaction', { context: value.type })}
            </Text>
          </HStack>
        </Button>
      ));

      // if the account transaction is fetching some more transactions, append a few loading skeletons
      if (accountTransaction.fetching) {
        nodes = [
          ...nodes,
          ...Array.from({ length: 3 }, () => (
            <HStack key={nanoid()} m={0} p={0} spacing={2} w="full">
              <Skeleton>
                <Text color="gray.500" fontSize="sm" maxW={175} noOfLines={1}>
                  {ellipseAddress(faker.random.alphaNumeric(58).toUpperCase())}
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
