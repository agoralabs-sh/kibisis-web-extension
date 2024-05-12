import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// components
import ChainBadge from '@extension/components/ChainBadge';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';

// types
import { INetwork } from '@extension/types';

interface IProps {
  network: INetwork;
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
}

const NetworkSelect: FC<IProps> = ({ network, networks, onSelect }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        borderRadius="md"
        px={4}
        py={2}
        transition="all 0.2s"
      >
        <HStack justifyContent="space-between" w="full">
          <Icon as={IoChevronDown} />
          <ChainBadge network={network} />
        </HStack>
      </MenuButton>
      <MenuList>
        {networks.map((value, index) => (
          <MenuItem
            key={`network-select-network-item-${index}`}
            minH="48px"
            onClick={() => onSelect(value)}
          >
            <ChainBadge network={value} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NetworkSelect;
