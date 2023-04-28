import { Box, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC, ElementType } from 'react';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  description: string;
  disabled?: boolean;
  icon: ElementType;
  onClick: () => void;
  title: string;
  tooltipText?: string;
}

const AccountTypeItem: FC<IProps> = ({
  description,
  disabled = false,
  icon,
  onClick,
  title,
  tooltipText,
}: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const renderContent = () => {
    return (
      <VStack alignItems="flex-start" spacing={4} w="full">
        <Icon as={icon} color={defaultTextColor} h={10} w={10} />
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text
            color={defaultTextColor}
            fontSize="md"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {title}
          </Text>
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
      </VStack>
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
          p={4}
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
        p={4}
      >
        {renderContent()}
      </Box>
    </Tooltip>
  );
};

export default AccountTypeItem;
