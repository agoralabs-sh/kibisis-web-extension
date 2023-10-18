import { Avatar, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import ChainBadge from '@extension/components/ChainBadge';
import SessionAvatar from '@extension/components/SessionAvatar';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';

interface IProps {
  caption: string;
  description?: string;
  host: string;
  iconUrl?: string;
  isWalletConnect?: boolean;
  name: string;
  network?: INetwork;
}

const SessionRequestHeader: FC<IProps> = ({
  caption,
  description,
  host,
  iconUrl,
  isWalletConnect = false,
  name,
  network,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <VStack alignItems="center" spacing={5} w="full">
      <HStack alignItems="center" justifyContent="center" spacing={4} w="full">
        {/*app icon */}
        {/*<Avatar name={name} size="sm" src={iconUrl} />*/}
        <SessionAvatar
          iconUrl={iconUrl}
          name={name}
          isWalletConnect={isWalletConnect}
        />

        {/*app name*/}
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {name}
        </Heading>
      </HStack>

      <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
        {/*app description*/}
        {description && (
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {description}
          </Text>
        )}

        {/*app host*/}
        <Box
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
        >
          <Text color={defaultTextColor} fontSize="xs" textAlign="center">
            {host}
          </Text>
        </Box>

        {/*network*/}
        {network && <ChainBadge network={network} />}

        {/*caption*/}
        <Text color={subTextColor} fontSize="sm" textAlign="center">
          {caption}
        </Text>
      </VStack>
    </VStack>
  );
};

export default SessionRequestHeader;
