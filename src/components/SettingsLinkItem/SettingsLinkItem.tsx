import { Button, ColorMode, HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { IconType } from 'react-icons';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// Constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '../../constants';

// Hooks
import useButtonHoverBackgroundColor from '../../hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

interface IProps {
  icon: IconType;
  label: string;
  to: string;
}

const SettingsLinkItem: FC<IProps> = ({ icon, label, to }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      as={Link}
      borderRadius={0}
      fontSize="md"
      h={SETTINGS_ITEM_HEIGHT}
      justifyContent="start"
      px={DEFAULT_GAP - 2}
      rightIcon={
        <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
      }
      to={to}
      variant="ghost"
      w="full"
    >
      <HStack
        alignItems="center"
        justifyContent="flex-start"
        spacing={2}
        w="full"
      >
        <Icon as={icon} color={defaultTextColor} h={6} w={6} />
        <Text color={defaultTextColor} fontSize="md">
          {label}
        </Text>
      </HStack>
    </Button>
  );
};

export default SettingsLinkItem;
