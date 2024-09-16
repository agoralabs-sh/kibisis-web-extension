import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { MINIMUM_TAB_HEIGHT } from '../../constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

interface IProps {
  connectionType: ConnectionTypeEnum;
}

const ConnectionNotSupportedContent: FC<IProps> = ({ connectionType }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      minH={MINIMUM_TAB_HEIGHT}
      w="full"
    >
      <Text
        color={defaultTextColor}
      >{`Connection "${connectionType}" not supported`}</Text>
    </VStack>
  );
};

export default ConnectionNotSupportedContent;
