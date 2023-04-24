import { Box, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';
import SignTxnsTextItem from './SignTxnsTextItem';

// Hooks
import useBorderColor from '@extension/hooks/useBorderColor';

// Selectors
import { useSelectAssetsByGenesisHash } from '@extension/selectors';

// Types
import { IAccount, IAsset, INativeCurrency, INetwork } from '@extension/types';

// Utils
import { computeGroupId } from '@common/utils';
import ApplicationTransactionContent from '@extension/components/SignTxnsModal/ApplicationTransactionContent';

interface IProps {
  fromAccounts: IAccount[];
  loading?: boolean;
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transactions: Transaction[];
}

const MultipleTransactionsContent: FC<IProps> = ({
  fromAccounts,
  loading = false,
  nativeCurrency,
  network,
  transactions,
}: IProps) => {
  const { t } = useTranslation();
  const borderColor: string = useBorderColor();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const [openAccordions, setOpenAccordions] = useState<boolean[]>(
    Array.from({ length: transactions.length }, () => false)
  );
  const computedGroupId: string = encodeBase64(computeGroupId(transactions));
  const handleToggleAccordion = (accordionIndex: number) => (open: boolean) => {
    setOpenAccordions(
      openAccordions.map((value, index) =>
        index === accordionIndex ? open : value
      )
    );
  };
  const renderContent = (
    transaction: Transaction,
    transactionIndex: number
  ) => {
    switch (transaction.type) {
      case 'appl':
        return (
          <ApplicationTransactionContent
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            nativeCurrency={network.nativeCurrency}
            network={network}
            transaction={transaction}
          />
        );
      case 'axfer':
        return (
          <AssetTransferTransactionContent
            asset={
              assets.find(
                (value) => value.id === String(transaction.assetIndex)
              ) || null
            }
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={loading}
            nativeCurrency={network.nativeCurrency}
            network={network}
            transaction={transaction}
          />
        );
      case 'pay':
        return (
          <PaymentTransactionContent
            fromAccount={fromAccounts[transactionIndex] || null}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            loading={loading}
            nativeCurrency={nativeCurrency}
            transaction={transaction}
          />
        );
      default:
        break;
    }

    return null;
  };

  return (
    <VStack spacing={4} w="full">
      {/*Group ID*/}
      <SignTxnsTextItem
        label={`${t<string>('labels.groupId')}:`}
        value={computedGroupId}
      />

      {/*Transactions*/}
      {transactions.map((transaction, index) => (
        <Box
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          key={nanoid()}
          px={4}
          py={2}
          w="full"
        >
          <VStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
            w="full"
          >
            {renderContent(transaction, index)}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default MultipleTransactionsContent;
