import { HStack, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  atomicUnitsAmount: BigNumber;
  decimals: number;
  displayUnit?: boolean;
  icon: ReactNode;
  label: string;
  unit?: string;
}

const SignTxnsAssetItem: FC<IProps> = ({
  atomicUnitsAmount,
  decimals,
  displayUnit = false,
  icon,
  label,
  unit,
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <HStack justifyContent="space-between" spacing={2} w="full">
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      <Tooltip
        aria-label="Asset amount with unrestricted decimals"
        label={`${convertToStandardUnit(
          atomicUnitsAmount,
          decimals
        ).toString()}${unit ? ` ${unit}` : ''}`}
      >
        <HStack spacing={1}>
          <Text color={subTextColor} fontSize="xs">
            {formatCurrencyUnit(
              convertToStandardUnit(atomicUnitsAmount, decimals)
            )}
          </Text>
          {icon}
          {displayUnit && unit && (
            <Text color={subTextColor} fontSize="xs">
              {unit}
            </Text>
          )}
        </HStack>
      </Tooltip>
    </HStack>
  );
};

export default SignTxnsAssetItem;
