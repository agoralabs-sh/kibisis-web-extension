import { Box, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowForwardOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const AccountTypeItem: FC<IProps> = ({
  description,
  disabled = false,
  icon,
  onClick,
  title,
  tooltipText,
}) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // renders
  const renderContent = () => {
    return (
      <HStack alignItems="center" spacing={DEFAULT_GAP / 2} w="full">
        {/*icon*/}
        <Icon as={icon} color={defaultTextColor} h={10} w={10} />

        <VStack alignItems="flex-start" spacing={2} w="full">
          {/*heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {title}
          </Text>

          {/*description*/}
          <Text
            color={subTextColor}
            fontSize="sm"
            maxW={400}
            noOfLines={2}
            textAlign="left"
          >
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
