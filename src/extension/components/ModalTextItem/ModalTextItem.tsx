import { Code, HStack, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import CopyIconButton from '@extension/components/CopyIconButton';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import WarningIcon from '@extension/components/WarningIcon';

// types
import type { IProps } from './types';

const ModalTextItem: FC<IProps> = ({
  copyButtonLabel,
  isCode = false,
  label,
  tooltipLabel,
  value,
  warningLabel,
  ...stackProps
}) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // renders
  const renderValue = () => {
    if (isCode) {
      return (
        <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
          {value}
        </Code>
      );
    }

    return (
      <Text color={defaultTextColor} fontSize="xs">
        {value}
      </Text>
    );
  };

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
      <Text color={defaultTextColor} fontSize="xs" w="35%">
        {label}
      </Text>

      <HStack
        flexGrow={1}
        justifyContent="flex-end"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*value*/}
        {tooltipLabel ? (
          <Tooltip
            aria-label={`A tooltip displaying the label ${tooltipLabel}`}
            label={tooltipLabel}
          >
            {renderValue()}
          </Tooltip>
        ) : (
          renderValue()
        )}

        {/*copy button*/}
        {copyButtonLabel && (
          <CopyIconButton
            ariaLabel={copyButtonLabel}
            tooltipLabel={copyButtonLabel}
            size="sm"
            value={value}
          />
        )}

        {/*warning*/}
        {warningLabel && <WarningIcon tooltipLabel={warningLabel} />}
      </HStack>
    </HStack>
  );
};

export default ModalTextItem;
