import { Center, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// Theme
import { theme } from '@extension/theme';

const LoadingPage: FC = () => {
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );

  return (
    <Center as="main" backgroundColor="var(--chakra-colors-chakra-body-bg)">
      <Flex
        alignItems="center"
        direction="column"
        justifyContent="center"
        minH="100vh"
        w="full"
      >
        <InfinitySpin color={primaryColor} width="200" />
      </Flex>
    </Center>
  );
};

export default LoadingPage;
