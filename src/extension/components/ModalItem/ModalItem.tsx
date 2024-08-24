import { HStack, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import WarningIcon from '@extension/components/WarningIcon';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const ModalItem: FC<IProps> = ({
  label,
  tooltipLabel,
  value,
  warningLabel,
  ...stackProps
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>

      <HStack
        flexGrow={1}
        justifyContent="flex-end"
        minH={MODAL_ITEM_HEIGHT}
        spacing={DEFAULT_GAP / 3}
      >
        {/*value*/}
        {tooltipLabel ? (
          <Tooltip
            aria-label={`A tooltip displaying the label ${tooltipLabel}`}
            label={tooltipLabel}
          >
            {value}
          </Tooltip>
        ) : (
          value
        )}

        {/*warning*/}
        {warningLabel && <WarningIcon tooltipLabel={warningLabel} />}
      </HStack>
    </HStack>
  );
};

export default ModalItem;
