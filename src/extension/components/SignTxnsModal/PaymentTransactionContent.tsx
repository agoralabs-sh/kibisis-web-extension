import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Hooks
import useAccount from '@extension/hooks/useAccount';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { INativeCurrency, INetwork } from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transaction: Transaction;
}

const PaymentTransactionContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transaction,
}: IProps) => {
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const { t } = useTranslation();
  const { account: fromAccount, fetching: fetchingAccountInformation } =
    useAccount({
      address: fromAddress,
      network,
    });
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const standardUnitAmount: BigNumber = convertToStandardUnit(
    new BigNumber(String(transaction.amount) || '0'),
    nativeCurrency.decimals
  );
  const icon: ReactNode = createIconFromDataUri(nativeCurrency.iconUri, {
    color: subTextColor,
    h: 3,
    w: 3,
  });

  return (
    <VStack spacing={4} w="full">
      {/* Amount */}
      <Tooltip
        aria-label="Asset amount with unrestricted decimals"
        label={`${standardUnitAmount.toString()} ${nativeCurrency.code}`}
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
          {createIconFromDataUri(nativeCurrency.iconUri, {
            color: defaultTextColor,
            h: 3,
            w: 3,
          })}
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {nativeCurrency.code}
          </Text>
        </HStack>
      </Tooltip>

      {/* From */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="From address"
        label={`${t<string>('labels.from')}:`}
      />

      {/* To */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.to.publicKey)}
        ariaLabel="To address"
        label={`${t<string>('labels.to')}:`}
      />

      {/* Balance */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(fromAccount?.atomicBalance || '0')}
        decimals={nativeCurrency.decimals}
        icon={icon}
        isLoading={fetchingAccountInformation}
        label={`${t<string>('labels.balance')}:`}
        unit={nativeCurrency.code}
      />

      {/* Fee */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(String(transaction.fee))}
        decimals={nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={nativeCurrency.code}
      />

      {/* Note */}
      {transaction.note && transaction.note.length > 0 && (
        <SignTxnsTextItem
          label={`${t<string>('labels.note')}:`}
          value={new TextDecoder().decode(transaction.note)}
        />
      )}
    </VStack>
  );
};

export default PaymentTransactionContent;
