import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { INativeCurrency } from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  transaction: Transaction;
}

const PaymentTransactionContent: FC<IProps> = ({
  nativeCurrency,
  transaction,
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const standardUnitAmount: BigNumber = convertToStandardUnit(
    new BigNumber(String(transaction.amount)),
    nativeCurrency.decimals
  );

  return (
    <VStack spacing={4} w="full">
      <HStack alignItems="center" justifyContent="center" spacing={2} w="full">
        <Tooltip
          aria-label="Asset amount with unrestricted decimals"
          label={standardUnitAmount.toString()}
        >
          <Heading color={defaultTextColor} size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
        </Tooltip>
        <Text color={subTextColor} fontSize="sm" textAlign="center">
          {nativeCurrency.code}
        </Text>
      </HStack>
    </VStack>
  );
};

export default PaymentTransactionContent;
