import { Box, HStack, Select, Spacer, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC } from 'react';

// Constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '../../constants';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

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
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
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
        <Text color={defaultTextColor} fontSize="sm">
          {label}
        </Text>
        {description && (
          <Text color={subTextColor} fontSize="xs">
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
};

export default SettingsSelectItem;
