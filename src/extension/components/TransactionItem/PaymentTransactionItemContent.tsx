import { Spacer, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import { IAccount, INetwork, IPaymentTransaction } from '@extension/types';

// utils
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  account: IAccount;
  network: INetwork;
  transaction: IPaymentTransaction;
}

const PaymentTransactionItemContent: FC<IProps> = ({
  account,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  const amount: BigNumber = new BigNumber(String(transaction.amount));

  return (
    <>
      <VStack alignItems="flex-start" justifyContent="center" spacing={2}>
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

      <Spacer />

      <VStack alignItems="flex-end" justifyContent="center" spacing={2}>
        {/*amount*/}
        <AssetDisplay
          atomicUnitAmount={amount}
          amountColor={
            amount.lte(0)
              ? defaultTextColor
              : transaction.receiver === accountAddress
              ? 'green.500'
              : 'red.500'
          }
          decimals={network.nativeCurrency.decimals}
          fontSize="sm"
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          prefix={
            amount.lte(0)
              ? undefined
              : transaction.receiver === accountAddress
              ? '+'
              : '-'
          }
          unit={network.nativeCurrency.symbol}
        />

        {/*completed date*/}
        {transaction.completedAt && (
          <Text color={subTextColor} fontSize="xs">
            {new Date(transaction.completedAt).toLocaleString()}
          </Text>
        )}
      </VStack>
    </>
  );
};

export default PaymentTransactionItemContent;
