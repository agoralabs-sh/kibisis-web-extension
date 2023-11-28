import { HStack, Switch, Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  checked: boolean;
  description?: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SettingsSwitchItem: FC<IProps> = ({
  checked,
  description,
  label,
  onChange,
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();

  return (
    <HStack
      alignItems="center"
      minH={SETTINGS_ITEM_HEIGHT}
      justifyContent="space-between"
      pb={DEFAULT_GAP - 2}
      px={DEFAULT_GAP - 2}
      spacing={2}
      w="full"
    >
      <VStack alignItems="flex-start" justifyContent="center" spacing={1}>
        <Text color={defaultTextColor} fontSize="sm">
          {label}
        </Text>
        {description && (
          <Text color={subTextColor} fontSize="xs">
            {description}
          </Text>
        )}
      </VStack>
      <Switch
        colorScheme={primaryColorScheme}
        isChecked={checked}
        onChange={onChange}
        size="lg"
      />
    </HStack>
  );
};

export default SettingsSwitchItem;
