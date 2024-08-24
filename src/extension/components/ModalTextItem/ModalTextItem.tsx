import { Code, HStack, Text, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import CopyIconButton from '@extension/components/CopyIconButton';
import WarningIcon from '@extension/components/WarningIcon';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const ModalTextItem: FC<IProps> = ({
  copyButtonLabel,
  fontSize = 'xs',
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
        <Code borderRadius="md" fontSize={fontSize} wordBreak="break-word">
          {value}
        </Code>
      );
    }

    return (
      <Text color={defaultTextColor} fontSize={fontSize} wordBreak="break-word">
        {value}
      </Text>
    );
  };

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize={fontSize} w="35%">
        {label}
      </Text>

      <HStack
        flexGrow={1}
        justifyContent="flex-end"
        minH={MODAL_ITEM_HEIGHT}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*value*/}
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel}>{renderValue()}</Tooltip>
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
