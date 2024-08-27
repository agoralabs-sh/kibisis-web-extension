import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import Select from '@extension/components/Select';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IOption } from '@extension/components/Select';
import type { IProps } from './types';

const SettingsSelectItem: FC<IProps> = ({
  _context,
  description,
  disabled,
  emptyOptionLabel,
  label,
  onChange,
  options,
  value,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // handlers
  const handleSelect = (option: IOption | null) => option && onChange(option);

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={SETTINGS_ITEM_HEIGHT}
      pb={DEFAULT_GAP - 2}
      px={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*label/description*/}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="center"
        spacing={1}
      >
        <Text color={defaultTextColor} fontSize="sm">
          {label}
        </Text>

        {description && (
          <Text color={subTextColor} fontSize="xs">
            {description}
          </Text>
        )}
      </VStack>

      {/*select*/}
      <Box minW="50%">
        <Select
          _context={_context}
          disabled={disabled}
          emptyOptionLabel={emptyOptionLabel}
          onSelect={handleSelect}
          options={options}
          value={value}
        />
      </Box>
    </HStack>
  );
};

export default SettingsSelectItem;
