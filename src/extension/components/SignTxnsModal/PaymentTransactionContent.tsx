import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAccount, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri, parseTransactionType } from '@extension/utils';

interface IProps {
  condensed?: ICondensedProps;
  fromAccount: IAccount | null;
  loading?: boolean;
  network: INetwork;
  transaction: Transaction;
}

const PaymentTransactionContent: FC<IProps> = ({
  condensed,
  fromAccount,
  loading = false,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const atomicUintAmount: BigNumber = new BigNumber(
    transaction.amount ? String(transaction.amount) : '0'
  );
  const standardUnitAmount: BigNumber = convertToStandardUnit(
    atomicUintAmount,
    network.nativeCurrency.decimals
  );
  const icon: ReactNode = createIconFromDataUri(
    network.nativeCurrency.iconUri,
    {
      color: subTextColor,
      h: 3,
      w: 3,
    }
  );
  const renderExtraInformation = () => (
    <>
      {/* Balance */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(fromAccount?.atomicBalance || '0')}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        isLoading={loading}
        label={`${t<string>('labels.balance')}:`}
        unit={network.nativeCurrency.code}
      />

      {/* Fee */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(String(transaction.fee))}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.code}
      />

      {/* Note */}
      {transaction.note && transaction.note.length > 0 && (
        <SignTxnsTextItem
          isCode={true}
          label={`${t<string>('labels.note')}:`}
          value={new TextDecoder().decode(transaction.note)}
        />
      )}
    </>
  );

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {condensed ? (
        <>
          {/*Heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: parseTransactionType(transaction),
            })}
          </Text>

          {/*Amount*/}
          <SignTxnsAssetItem
            atomicUnitsAmount={atomicUintAmount}
            decimals={network.nativeCurrency.decimals}
            icon={icon}
            label={`${t<string>('labels.amount')}:`}
            unit={network.nativeCurrency.code}
          />
        </>
      ) : (
        <>
          {/*Amount*/}
          <Tooltip
            aria-label="Amount with unrestricted decimals"
            label={`${standardUnitAmount.toString()} ${
              network.nativeCurrency.code
            }`}
          >
            <HStack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              w="full"
            >
              <Heading color={defaultTextColor} size="lg" textAlign="center">
                {formatCurrencyUnit(standardUnitAmount)}
              </Heading>
              {icon}
              <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                {network.nativeCurrency.code}
              </Text>
            </HStack>
          </Tooltip>

          {/*Heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: parseTransactionType(transaction),
            })}
          </Text>
        </>
      )}

      {/* From */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="From address"
        label={`${t<string>('labels.from')}:`}
        network={network}
      />

      {/* To */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.to.publicKey)}
        ariaLabel="To address"
        label={`${t<string>('labels.to')}:`}
        network={network}
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={2} w="full">
            {renderExtraInformation()}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation()
      )}
    </VStack>
  );
};

export default PaymentTransactionContent;
