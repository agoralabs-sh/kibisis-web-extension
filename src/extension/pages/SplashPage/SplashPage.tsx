import { Center, Flex } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import AnimatedKibisisIcon from '@extension/components/AnimatedKibisisIcon';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SplashPage: FC = () => {
  // hooks
  const primaryColor = usePrimaryColor();
  // misc
  const iconSize = calculateIconSize('xl');

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <Flex
        alignItems="center"
        direction="column"
        justifyContent="center"
        minH="100vh"
        w="full"
      >
        <AnimatedKibisisIcon color={primaryColor} h={iconSize} w={iconSize} />
      </Flex>
    </Center>
  );
};

export default SplashPage;
