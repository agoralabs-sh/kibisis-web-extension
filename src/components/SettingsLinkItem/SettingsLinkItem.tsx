import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IconType } from 'react-icons';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// Constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '../../constants';

interface IProps {
  icon: IconType;
  label: string;
  to: string;
}

const SettingsLinkItem: FC<IProps> = ({ icon, label, to }: IProps) => (
  <Button
    as={Link}
    borderRadius={0}
    colorScheme="gray"
    fontSize="md"
    h={SETTINGS_ITEM_HEIGHT}
    justifyContent="start"
    px={DEFAULT_GAP - 2}
    rightIcon={<Icon as={IoChevronForward} color="gray.500" h={6} w={6} />}
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
      <Icon as={icon} color="gray.500" h={6} w={6} />
      <Text color="gray.500" fontSize="md">
        {label}
      </Text>
    </HStack>
  </Button>
);

export default SettingsLinkItem;
