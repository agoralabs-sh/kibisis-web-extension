import { Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// Components
import AddressDisplay from '@extension/components/AddressDisplay';
import PaymentTransactionItemContent from './PaymentTransactionItemContent';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Services
import { AccountService } from '@extension/services';

// Types
import { IAccount, INetwork, ITransactions } from '@extension/types';

// Utils
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
  const subTextColor: string = useSubTextColor();
  const renderContent = () => {
    switch (transaction.type) {
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
          <VStack alignItems="flex-start" justifyContent="center" spacing={1}>
            {/*type*/}
            <Text color={defaultTextColor} fontSize="sm">
              {t<string>('headings.transaction', { context: transaction.type })}
            </Text>

            {/*from*/}
            <AddressDisplay
              address={transaction.sender}
              color={subTextColor}
              fontSize="xs"
              network={network}
            />
          </VStack>
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
        {renderContent()}
      </HStack>
    </Button>
  );
};

export default TransactionItem;
