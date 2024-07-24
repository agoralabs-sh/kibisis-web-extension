import { Center, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// theme
import { theme } from '@extension/theme';

const LoadingPage: FC = () => {
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
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
