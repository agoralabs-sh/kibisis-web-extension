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
import type { IProps } from './types';

const NetworkSelect: FC<IProps> = ({ network, networks, onSelect }) => {
  return (
    <Menu>
      <MenuButton borderRadius="full" p={0} transition="all 0.2s">
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
