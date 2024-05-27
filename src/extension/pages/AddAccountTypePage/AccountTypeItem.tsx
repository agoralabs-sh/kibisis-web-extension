import { Box, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowForwardOutline } from 'react-icons/io5';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import { DEFAULT_GAP } from '@extension/constants';

// types
import type { IItemProps } from './types';

const AccountTypeItem: FC<IItemProps> = ({
  description,
  disabled = false,
  icon,
  onClick,
  title,
  tooltipText,
}) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  //renders
  const renderContent = () => {
    return (
      <HStack alignItems="center" minH={28} spacing={DEFAULT_GAP / 2} w="full">
        {/*icon*/}
        <Icon as={icon} color={defaultTextColor} h={10} w={10} />

        <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
          {/*heading*/}
          <Text color={defaultTextColor} fontSize="md" textAlign="left">
            {title}
          </Text>

          {/*description*/}
          <Text color={subTextColor} fontSize="sm" textAlign="left">
            {description}
          </Text>
        </VStack>

        {/*icon*/}
        <Icon as={IoArrowForwardOutline} color={defaultTextColor} h={6} w={6} />
      </HStack>
    );
  };

  if (disabled) {
    return (
      <Tooltip label={tooltipText || description}>
        <Box
          as="button"
          bg={buttonHoverBackgroundColor}
          borderColor={defaultTextColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          cursor="not-allowed"
          opacity={0.5}
          p={DEFAULT_GAP - 2}
        >
          {renderContent()}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={tooltipText || description}>
      <Box
        as="button"
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        borderColor={defaultTextColor}
        borderRadius="md"
        borderStyle="solid"
        borderWidth={1}
        onClick={onClick}
        p={DEFAULT_GAP - 2}
      >
        {renderContent()}
      </Box>
    </Tooltip>
  );
};

export default AccountTypeItem;
