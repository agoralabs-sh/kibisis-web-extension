import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC, MouseEvent } from 'react';

// components
import Button from '@extension/components/Button';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  buttonLabel: string;
  description?: string;
  isWarning?: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SettingsButtonItem: FC<IProps> = ({
  buttonLabel,
  description,
  isWarning = false,
  label,
  onClick,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // misc
  let buttonTextColor: string = primaryButtonTextColor;
  let buttonColorScheme: string = primaryColorScheme;

  if (isWarning) {
    buttonTextColor = 'white';
    buttonColorScheme = 'red';
  }

  return (
    <Box
      minH={SETTINGS_ITEM_HEIGHT}
      pb={DEFAULT_GAP - 2}
      px={DEFAULT_GAP - 2}
      w="full"
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        w="full"
      >
        <VStack alignItems="flex-start" justifyContent="center" spacing={1}>
          {/*label*/}
          <Text color={defaultTextColor} fontSize="sm">
            {label}
          </Text>

          {/*description*/}
          {description && (
            <Text color={subTextColor} fontSize="xs">
              {description}
            </Text>
          )}
        </VStack>

        {/*button*/}
        <Button
          color={buttonTextColor}
          colorScheme={buttonColorScheme}
          onClick={onClick}
          w="50%"
        >
          {buttonLabel}
        </Button>
      </HStack>
    </Box>
  );
};

export default SettingsButtonItem;
