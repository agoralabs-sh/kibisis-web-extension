import { Center, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

// Theme
import { theme } from '@extension/theme';

const LoadingPage: FC = () => (
  <Center as="main" backgroundColor="var(--chakra-colors-chakra-body-bg)">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      minH="100vh"
      w="full"
    >
      <InfinitySpin color={theme.colors.primary['500']} width="200" />
    </Flex>
  </Center>
);

export default LoadingPage;
