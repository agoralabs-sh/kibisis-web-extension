import { Box, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonHoverColor from '@extension/hooks/usePrimaryButtonHoverColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const AccountTypeItem: FC<IItemProps> = ({
  description,
  disabled = false,
  icon,
  onClick,
  title,
  tooltipText,
}) => {
  const width = 32;
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonHoverColor = usePrimaryButtonHoverColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();
  //renders
  const renderContent = () => {
    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        minH={width}
        spacing={DEFAULT_GAP / 3}
        w={width}
      >
        {/*icon*/}
        <Icon
          as={icon}
          color={primaryButtonTextColor}
          boxSize={calculateIconSize('lg')}
        />

        {/*heading*/}
        <Text
          color={primaryButtonTextColor}
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {title}
        </Text>
      </VStack>
    );
  };

  if (disabled) {
    return (
      <Tooltip label={tooltipText || description}>
        <Box
          aria-label={description}
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
        aria-label={description}
        as="button"
        _hover={{
          bg: primaryButtonHoverColor,
        }}
        backgroundColor={primaryColor}
        borderRadius="md"
        onClick={onClick}
        p={DEFAULT_GAP - 2}
        transitionDuration="var(--chakra-transition-duration-normal)"
        transitionProperty="var(--chakra-transition-property-common)"
      >
        {renderContent()}
      </Box>
    </Tooltip>
  );
};

export default AccountTypeItem;
