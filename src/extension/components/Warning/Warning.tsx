import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// types
import type { IProps } from './types';

const Warning: FC<IProps> = ({ message, size = 'md' }) => {
  // hooks
  const color = useColorModeValue('orange.500', 'yellow.500');
  // misc
  let iconSize = 8;

  switch (size) {
    case 'lg':
      iconSize = 10;

      break;
    case 'sm':
      iconSize = 6;

      break;
    case 'xs':
      iconSize = 3;

      break;
    case 'md':
    default:
      break;
  }

  return (
    <HStack
      borderColor={color}
      borderRadius="md"
      borderStyle="solid"
      borderWidth={1}
      px={2}
      py={1}
      spacing={DEFAULT_GAP / 3}
    >
      {/*icon*/}
      <Icon as={IoWarningOutline} color={color} h={iconSize} w={iconSize} />

      {/*message*/}
      <Text as="b" color={color} fontSize={size} textAlign="left">
        {message}
      </Text>
    </HStack>
  );
};

export default Warning;
