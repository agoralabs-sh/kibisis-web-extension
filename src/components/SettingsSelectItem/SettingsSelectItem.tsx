import { Box, HStack, Select, Spacer, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC } from 'react';

// Constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '../../constants';

interface IOption {
  label: string;
  value: string | readonly string[] | number;
}
interface IProps {
  description?: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: IOption[];
  value: string | readonly string[] | number | undefined;
}

const SettingsSelectItem: FC<IProps> = ({
  description,
  label,
  onChange,
  options,
  value,
}: IProps) => (
  <HStack
    alignItems="center"
    h={SETTINGS_ITEM_HEIGHT}
    justifyContent="space-between"
    px={DEFAULT_GAP - 2}
    spacing={2}
    w="full"
  >
    <VStack
      alignItems="flex-start"
      flexGrow={1}
      justifyContent="center"
      spacing={1}
    >
      <Text color="gray.500" fontSize="sm">
        {label}
      </Text>
      {description && (
        <Text color="gray.400" fontSize="xs">
          {description}
        </Text>
      )}
    </VStack>
    <Box>
      <Select onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={nanoid()} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Box>
  </HStack>
);

export default SettingsSelectItem;
