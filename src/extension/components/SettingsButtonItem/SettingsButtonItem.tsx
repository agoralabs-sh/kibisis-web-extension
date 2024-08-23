import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import Button from '@extension/components/Button';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const SettingsButtonItem: FC<IProps> = ({
  buttonLabel,
  description,
  isWarning = false,
  label,
  onClick,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

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
        spacing={DEFAULT_GAP / 3}
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
          onClick={onClick}
          w="50%"
          {...(isWarning && {
            colorScheme: 'red',
          })}
        >
          {buttonLabel}
        </Button>
      </HStack>
    </Box>
  );
};

export default SettingsButtonItem;
