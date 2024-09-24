import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import SessionAvatar from '@extension/components/SessionAvatar';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const ClientHeader: FC<IProps> = ({ description, host, iconUrl, name }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const textBackgroundColor = useTextBackgroundColor();

  return (
    <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
      <HStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
        {/*icon */}
        <SessionAvatar iconUrl={iconUrl} name={name} />

        <VStack
          alignItems="flex-start"
          flexGrow={1}
          justifyContent="space-evenly"
          spacing={1}
          w="full"
        >
          {/*name*/}
          <Heading color={defaultTextColor} size="md">
            {name}
          </Heading>

          {/*host*/}
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs">
              {host}
            </Text>
          </Box>
        </VStack>
      </HStack>

      {/*description*/}
      {description && (
        <Text color={defaultTextColor} fontSize="sm">
          {description}
        </Text>
      )}
    </VStack>
  );
};

export default ClientHeader;
