import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { MINIMUM_TAB_HEIGHT } from '../../constants';

const ConnectionNotInitializedContent: FC = () => (
  <VStack
    alignItems="center"
    justifyContent="center"
    minH={MINIMUM_TAB_HEIGHT}
    w="full"
  >
    <Text>{`Connection not initialized`}</Text>
  </VStack>
);

export default ConnectionNotInitializedContent;
