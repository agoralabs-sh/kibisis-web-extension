import { HStack, Skeleton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';

// Constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps extends StackProps {
  atomicUnitsAmount: BigNumber;
  decimals: number;
  displayUnit?: boolean;
  icon: ReactNode;
  isLoading?: boolean;
  label: string;
  unit?: string;
}

const SignTxnsAssetItem: FC<IProps> = ({
  atomicUnitsAmount,
  decimals,
  displayUnit = false,
  icon,
  isLoading = false,
  label,
  unit,
  ...stackProps
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={2}
      w="full"
      {...stackProps}
    >
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      {isLoading ? (
        <Skeleton>
          <HStack spacing={1}>
            <Text color={subTextColor} fontSize="xs">
              0.001
            </Text>
            {icon}
          </HStack>
        </Skeleton>
      ) : (
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
      )}
    </HStack>
  );
};

export default SignTxnsAssetItem;
