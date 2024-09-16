import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { MINIMUM_TAB_HEIGHT } from '../../constants';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

const ConnectionNotInitializedContent: FC = () => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      minH={MINIMUM_TAB_HEIGHT}
      w="full"
    >
      <Text color={defaultTextColor}>{`Connection not initialized`}</Text>
    </VStack>
  );
};

export default ConnectionNotInitializedContent;
