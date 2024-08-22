import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// types
import type { INetwork } from '@extension/types';
import type { IProps } from './types';

const NetworkSelect: FC<IProps> = ({ context, networks, onSelect, value }) => {
  // handlers
  const handleOnSelect = (_value: INetwork) => () => onSelect(_value);

  return (
    <Menu>
      <MenuButton borderRadius="full" p={0} transition="all 0.2s">
        <HStack justifyContent="space-between" w="full">
          <Icon as={IoChevronDown} />

          <NetworkBadge network={value} />
        </HStack>
      </MenuButton>

      <MenuList>
        {networks.map((_value, index) => (
          <MenuItem
            key={`${context}-network-select-item-${index}`}
            minH={DEFAULT_GAP * 2}
            onClick={handleOnSelect(_value)}
          >
            <NetworkBadge network={_value} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NetworkSelect;
