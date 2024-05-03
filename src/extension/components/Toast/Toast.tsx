import {
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const Toast: FC<IProps> = ({ description, onClose, title, type = 'info' }) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const backgroundColor = useColorModeValue('gray.200', 'gray.600');
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  // handlers
  const handleCloseClick = () => onClose();
  let color = primaryColor;
  let icon = IoInformationCircleOutline;

  switch (type) {
    case 'error':
      color = 'red.500';
      icon = IoCloseCircleOutline;
      break;
    case 'success':
      color = 'green.500';
      icon = IoCheckmarkCircleOutline;
      break;
    case 'info':
    default:
      break;
  }

  return (
    <HStack
      bg={backgroundColor}
      boxShadow="xl"
      borderLeftColor={color}
      borderLeftWidth="4px"
      borderRadius="4px"
      p={DEFAULT_GAP / 2}
      spacing={DEFAULT_GAP / 2}
      w="full"
    >
      <Icon as={icon} color={color} h={DEFAULT_GAP} w={DEFAULT_GAP} />

      <VStack spacing={DEFAULT_GAP / 3} w="full">
        <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
          {title}
        </Text>

        {description && (
          <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
            {description}
          </Text>
        )}
      </VStack>

      <Spacer />

      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label="Close toast"
        icon={<Icon as={IoCloseOutline} color={defaultTextColor} />}
        onClick={handleCloseClick}
        size="sm"
        variant="ghost"
      />
    </HStack>
  );
};

export default Toast;
