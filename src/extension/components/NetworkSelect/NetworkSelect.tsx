import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { FC, ReactElement } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork } from '@extension/types';
import type { IProps } from './types';

const NetworkSelect: FC<IProps> = ({
  context,
  customNodes,
  networks,
  onSelect,
  selectedCustomNode,
  selectedNetwork,
}) => {
  // handlers
  const handleOnSelect = (value: ICustomNodeItem | INetwork) => () =>
    onSelect(value);

  return (
    <Menu>
      <MenuButton borderRadius="full" p={0} transition="all 0.2s">
        <HStack justifyContent="space-between" w="full">
          <Icon as={IoChevronDown} />

          <NetworkBadge
            customNode={selectedCustomNode}
            network={selectedNetwork}
          />
        </HStack>
      </MenuButton>

      <MenuList>
        {[...customNodes, ...networks].reduce<ReactElement[]>(
          (acc, currentValue, currentIndex) => {
            let _customNodeNetwork: INetwork | null;

            if (currentValue.discriminator === 'ICustomNodeItem') {
              _customNodeNetwork =
                networks.find(
                  (_value) => _value.genesisHash === currentValue.genesisHash
                ) || null;

              if (!_customNodeNetwork) {
                return acc;
              }

              return [
                ...acc,
                <MenuItem
                  key={`${context}-network-select-item-${currentIndex}`}
                  minH={DEFAULT_GAP * 2}
                  onClick={handleOnSelect(currentValue)}
                >
                  <NetworkBadge
                    customNode={currentValue}
                    network={_customNodeNetwork}
                  />
                </MenuItem>,
              ];
            }

            return [
              ...acc,
              <MenuItem
                key={`${context}-network-select-item-${currentIndex}`}
                minH={DEFAULT_GAP * 2}
                onClick={handleOnSelect(currentValue)}
              >
                <NetworkBadge network={currentValue} />
              </MenuItem>,
            ];
          },
          []
        )}
      </MenuList>
    </Menu>
  );
};

export default NetworkSelect;
