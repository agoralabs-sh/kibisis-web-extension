import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

interface IProps {
  message: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const Warning: FC<IProps> = ({ message, size = 'md' }: IProps) => {
  // misc
  const color: string = 'red.500';
  let iconSize: number = 8;

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
      backgroundColor={color}
      borderColor={color}
      borderRadius="md"
      borderStyle="solid"
      borderWidth={1}
      px={2}
      py={1}
      spacing={2}
    >
      {/*icon*/}
      <Icon as={IoWarningOutline} color="white" h={iconSize} w={iconSize} />

      {/*message*/}
      <Text as="b" color="white" fontSize={size} textAlign="left">
        {message}
      </Text>
    </HStack>
  );
};

export default Warning;
