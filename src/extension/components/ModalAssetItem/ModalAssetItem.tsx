import { HStack, Skeleton, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AssetDisplay from '@extension/components/AssetDisplay';
import WarningIcon from '@extension/components/WarningIcon';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const ModalAssetItem: FC<IProps> = ({
  amountInAtomicUnits,
  decimals,
  displayUnit = true,
  icon,
  isLoading = false,
  label,
  unit,
  warningLabel,
  ...stackProps
}: IProps) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize="xs" w="full">
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
        <>
          <AssetDisplay
            atomicUnitAmount={amountInAtomicUnits}
            amountColor={subTextColor}
            decimals={decimals}
            displayUnit={displayUnit}
            fontSize="xs"
            icon={icon}
            unit={unit}
          />

          {/*warning*/}
          {warningLabel && <WarningIcon tooltipLabel={warningLabel} />}
        </>
      )}
    </HStack>
  );
};

export default ModalAssetItem;
