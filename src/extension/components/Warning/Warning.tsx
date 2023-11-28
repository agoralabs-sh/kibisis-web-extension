import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

// theme
import { theme } from '@extension/theme';

interface IProps {
  message: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const Warning: FC<IProps> = ({ message, size = 'md' }: IProps) => {
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
      backgroundColor="red.500"
      borderColor="red.500"
      borderRadius={theme.radii['3xl']}
      borderStyle="solid"
      borderWidth={1}
      px={2}
      py={1}
      spacing={2}
    >
      <Icon as={IoWarningOutline} color="white" h={iconSize} w={iconSize} />
      <Text color="white" fontWeight={600} fontSize={size} textAlign="left">
        {message}
      </Text>
    </HStack>
  );
};

export default Warning;
