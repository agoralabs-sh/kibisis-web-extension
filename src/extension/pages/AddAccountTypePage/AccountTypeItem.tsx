import { Box, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useBorderColor from '@extension/hooks/useBorderColor';
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
  icon,
  isDisabled = false,
  onClick,
  title,
  tooltipText,
}) => {
  const width = 32;
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonHoverColor = usePrimaryButtonHoverColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();
  // misc
  const textColor = isDisabled ? defaultTextColor : primaryButtonTextColor;
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
        <Icon as={icon} color={textColor} boxSize={calculateIconSize('lg')} />

        {/*heading*/}
        <Text color={textColor} fontSize="sm" textAlign="center" w="full">
          {title}
        </Text>
      </VStack>
    );
  };

  if (isDisabled) {
    return (
      <Tooltip label={tooltipText || description}>
        <Box
          aria-label={description}
          as="button"
          bg={buttonHoverBackgroundColor}
          borderColor={borderColor}
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
