import { Avatar, Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import WalletConnectIcon from '@extension/components/WalletConnectIcon';

interface IProps {
  iconUrl?: string;
  isWalletConnect?: boolean;
  name: string;
  size?: 'sm' | 'md';
}

const SessionAvatar: FC<IProps> = ({
  iconUrl,
  isWalletConnect = false,
  name,
  size = 'md',
}: IProps) => {
  let walletConnectContainerSize: number = 5;
  let walletConnectIconSize: number = 4;

  switch (size) {
    case 'sm':
      walletConnectContainerSize = 4;
      walletConnectIconSize = 3;
      break;
    default:
      break;
  }

  return (
    <Box position="relative" p={1}>
      {/*app icon */}
      <Avatar name={name} size={size} src={iconUrl} />

      {/*walletconnect badge*/}
      {isWalletConnect && (
        <Flex
          alignItems="center"
          bg="walletConnect.500"
          borderRadius="var(--chakra-radii-full)"
          bottom={0}
          h={walletConnectContainerSize}
          justifyContent="center"
          position="absolute"
          right={0}
          w={walletConnectContainerSize}
        >
          <WalletConnectIcon
            color="white"
            h={walletConnectIconSize}
            w={walletConnectIconSize}
          />
        </Flex>
      )}
    </Box>
  );
};

export default SessionAvatar;
