import { Button, HStack, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import ApplicationTransactionItemContent from './ApplicationTransactionItemContent';
import DefaultTransactionItemContent from './DefaultTransactionItemContent';
import PaymentTransactionItemContent from './PaymentTransactionItemContent';

// constants
import {
  ACCOUNTS_ROUTE,
  TAB_ITEM_HEIGHT,
  TRANSACTIONS_ROUTE,
} from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// services
import { AccountService } from '@extension/services';

// types
import { IAccount, INetwork, ITransactions } from '@extension/types';

// utils
import AssetTransferTransactionItemContent from './AssetTransferTransactionItemContent';

interface IProps {
  account: IAccount;
  network: INetwork;
  transaction: ITransactions;
}

const TransactionItem: FC<IProps> = ({
  account,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const renderContent = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.ApplicationClearState:
      case TransactionTypeEnum.ApplicationCloseOut:
      case TransactionTypeEnum.ApplicationCreate:
      case TransactionTypeEnum.ApplicationDelete:
      case TransactionTypeEnum.ApplicationNoOp:
      case TransactionTypeEnum.ApplicationOptIn:
      case TransactionTypeEnum.ApplicationUpdate:
        return <ApplicationTransactionItemContent transaction={transaction} />;
      case TransactionTypeEnum.AssetTransfer:
        return (
          <AssetTransferTransactionItemContent
            account={account}
            network={network}
            transaction={transaction}
          />
        );

      case TransactionTypeEnum.Payment:
        return (
          <PaymentTransactionItemContent
            account={account}
            network={network}
            transaction={transaction}
          />
        );
      default:
        return (
          <DefaultTransactionItemContent
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
      to={`${ACCOUNTS_ROUTE}/${AccountService.convertPublicKeyToAlgorandAddress(
        account.publicKey
      )}${TRANSACTIONS_ROUTE}/${transaction.id}`}
      variant="ghost"
      w="full"
    >
      <HStack m={0} p={0} spacing={2} w="full">
        {renderContent()}
      </HStack>
    </Button>
  );
};

export default TransactionItem;
