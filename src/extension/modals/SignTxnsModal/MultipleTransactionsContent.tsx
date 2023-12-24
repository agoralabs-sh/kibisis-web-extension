import { Box, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import KeyRegistrationTransactionContent from './KeyRegistrationTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';
import SignTxnsTextItem from './SignTxnsTextItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';

// selectors
import { useSelectStandardAssetsByGenesisHash } from '@extension/selectors';

// types
import {
  IAccount,
  IStandardAsset,
  IExplorer,
  INetwork,
} from '@extension/types';

// utils
import { computeGroupId } from '@common/utils';
import { parseTransactionType } from '@extension/utils';

interface IProps {
  explorer: IExplorer;
  fromAccounts: IAccount[];
  loadingAccountInformation?: boolean;
  loadingAssetInformation?: boolean;
  network: INetwork;
  transactions: Transaction[];
}

const MultipleTransactionsContent: FC<IProps> = ({
  explorer,
  fromAccounts,
  loadingAccountInformation = false,
  loadingAssetInformation = false,
  network,
  transactions,
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const assets: IStandardAsset[] = useSelectStandardAssetsByGenesisHash(
    network.genesisHash
  );
  // hooks
  const borderColor: string = useBorderColor();
  // state
  const [openAccordions, setOpenAccordions] = useState<boolean[]>(
    Array.from({ length: transactions.length }, () => false)
  );
  // handlers
  const handleToggleAccordion = (accordionIndex: number) => (open: boolean) => {
    setOpenAccordions(
      openAccordions.map((value, index) =>
        index === accordionIndex ? open : value
      )
    );
  };
  // misc
  const computedGroupId: string = encodeBase64(computeGroupId(transactions));
  const renderContent = (
    transaction: Transaction,
    transactionIndex: number
  ) => {
    const asset: IStandardAsset | null =
      assets.find((value) => value.id === String(transaction.assetIndex)) ||
      null;
    const transactionType: TransactionTypeEnum = parseTransactionType(
      transaction.get_obj_for_encoding(),
      {
        network,
        sender: fromAccounts[transactionIndex] || null,
      }
    );

    switch (transaction.type) {
      case 'acfg':
        if (transactionType === TransactionTypeEnum.AssetCreate) {
          return (
            <AssetCreateTransactionContent
              condensed={{
                expanded: openAccordions[transactionIndex],
                onChange: handleToggleAccordion(transactionIndex),
              }}
              fromAccount={fromAccounts[transactionIndex] || null}
              loading={loadingAccountInformation}
              network={network}
              transaction={transaction}
            />
          );
        }

        return (
          <AssetConfigTransactionContent
            asset={asset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={loadingAccountInformation || loadingAssetInformation}
            network={network}
            transaction={transaction}
          />
        );
      case 'afrz':
        return (
          <AssetFreezeTransactionContent
            asset={asset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={loadingAccountInformation || loadingAssetInformation}
            network={network}
            transaction={transaction}
          />
        );
      case 'appl':
        return (
          <ApplicationTransactionContent
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            network={network}
            transaction={transaction}
          />
        );
      case 'axfer':
        return (
          <AssetTransferTransactionContent
            asset={asset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={loadingAccountInformation || loadingAssetInformation}
            network={network}
            transaction={transaction}
          />
        );
      case 'keyreg':
        return (
          <KeyRegistrationTransactionContent
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccounts[transactionIndex] || null}
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
            loading={loadingAccountInformation}
            network={network}
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
          key={`sign-bytes-modal-item-${index}`}
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
