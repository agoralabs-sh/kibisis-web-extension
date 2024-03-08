import { HStack, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import WarningIcon from '@extension/components/WarningIcon';

// constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

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
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={2}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>

      <HStack flexGrow={1} justifyContent="flex-end" spacing={2} w="full">
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
