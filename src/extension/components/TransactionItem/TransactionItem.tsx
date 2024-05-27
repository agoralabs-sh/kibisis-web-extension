import { Button, HStack, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AccountReKeyTransactionItemContent from './AccountReKeyTransactionItemContent';
import AccountUndoReKeyTransactionItemContent from './AccountUndoReKeyTransactionItemContent';
import ApplicationTransactionItemContent from './ApplicationTransactionItemContent';
import ARC0200AssetTransferTransactionItemContent from './ARC0200AssetTransferTransactionItemContent';
import AssetTransferTransactionItemContent from './AssetTransferTransactionItemContent';
import DefaultTransactionItemContent from './DefaultTransactionItemContent';
import PaymentTransactionItemContent from './PaymentTransactionItemContent';

// constants
import {
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
  TRANSACTIONS_ROUTE,
} from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectARC0200AssetsBySelectedNetwork } from '@extension/selectors';

// types
import type { IARC0200AssetTransferTransaction } from '@extension/types';
import type { IProps } from './types';

// utils
import parseARC0200Transaction from '@extension/utils/parseARC0200Transaction';

const TransactionItem: FC<IProps> = ({
  account,
  accounts,
  network,
  transaction,
}) => {
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  // renders
  const renderContent = () => {
    let arc0200Transaction: IARC0200AssetTransferTransaction | null;

    switch (transaction.type) {
      case TransactionTypeEnum.AccountUndoReKey:
        return (
          <AccountUndoReKeyTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AccountReKey:
        return (
          <AccountReKeyTransactionItemContent
            account={account}
            accounts={accounts}
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
          <ApplicationTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.ApplicationNoOp:
        if (arc0200Assets.find(({ id }) => id === transaction.applicationId)) {
          arc0200Transaction = parseARC0200Transaction(transaction);

          if (
            arc0200Transaction?.type ===
            TransactionTypeEnum.ARC0200AssetTransfer
          ) {
            return (
              <ARC0200AssetTransferTransactionItemContent
                account={account}
                accounts={accounts}
                network={network}
                transaction={arc0200Transaction}
              />
            );
          }
        }

        return (
          <ApplicationTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetTransfer:
        return (
          <AssetTransferTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );

      case TransactionTypeEnum.Payment:
        return (
          <PaymentTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );
      default:
        return (
          <DefaultTransactionItemContent
            account={account}
            accounts={accounts}
            network={network}
            transaction={transaction}
          />
        );
    }
  };

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      as={Link}
      borderRadius={0}
      fontSize="md"
      h={TAB_ITEM_HEIGHT}
      justifyContent="start"
      pl={3}
      pr={1}
      py={0}
      rightIcon={
        <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
      }
      to={`${TRANSACTIONS_ROUTE}/${transaction.id}`}
      variant="ghost"
      w="full"
    >
      <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
        {renderContent()}
      </HStack>
    </Button>
  );
};

export default TransactionItem;
