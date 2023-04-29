import { HStack, Skeleton, StackProps, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';

// Components
import AssetDisplay from '@extension/components/AssetDisplay';

// Constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps extends StackProps {
  atomicUnitAmount: BigNumber;
  decimals: number;
  displayUnit?: boolean;
  icon: ReactNode;
  isLoading?: boolean;
  label: string;
  unit?: string;
}

const SignTxnsAssetItem: FC<IProps> = ({
  atomicUnitAmount,
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
        <AssetDisplay
          atomicUnitAmount={atomicUnitAmount}
          color={subTextColor}
          decimals={decimals}
          displayUnit={true}
          fontSize="xs"
          icon={icon}
          unit={unit}
        />
      )}
    </HStack>
  );
};

export default SignTxnsAssetItem;
