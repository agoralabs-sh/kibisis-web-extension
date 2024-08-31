import {
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React, { type FC, Fragment } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';
import {
  ALGORAND_TEST_NET_GENESIS_HASH,
  VOI_TEST_NET_GENESIS_HASH,
} from '../../constants';

// config
import { networks } from '@extension/config';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

// types
import type { IProps, IHandleConnectParams } from './types';

const ConnectMenu: FC<IProps> = ({ onConnect, onDisconnect, toast }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // handlers
  const handleConnect = (params: IHandleConnectParams) => () => {
    const network =
      networks.find((value) => value.genesisHash === params.genesisHash) ||
      null;

    // if there is no known network, just error early
    if (!network) {
      toast({
        description: `Network "${params.genesisHash}" not found`,
        status: 'error',
        title: `Unknown Network`,
      });

      return;
    }

    onConnect({
      connectionType: params.connectionType,
      network,
    });
  };
  const handleDisconnect = () => onDisconnect();
  // renders
  const renderNetworkTag = () => (
    <Tag colorScheme="yellow" size="sm" variant="solid">
      <TagLabel>TestNet</TagLabel>
    </Tag>
  );

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: 'gray.400' }}
        _expanded={{ bg: 'primary.400' }}
        _focus={{ boxShadow: 'outline' }}
        color={defaultTextColor}
        px={DEFAULT_GAP - 2}
        py={DEFAULT_GAP / 3}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
      >
        Connect <ChevronDownIcon />
      </MenuButton>

      <MenuList>
        {[
          ConnectionTypeEnum.AlgorandProvider,
          ConnectionTypeEnum.AVMWebProvider,
          ConnectionTypeEnum.UseWallet,
        ].map((connectionType, index, array) => {
          const dividerElement =
            index < array.length - 1 ? <MenuDivider /> : null;

          return (
            <Fragment key={`connect-menu-item=${index}`}>
              {index === 0 && dividerElement}

              <MenuGroup color={defaultTextColor} title={connectionType}>
                <MenuItem
                  onClick={handleConnect({
                    connectionType,
                    genesisHash: ALGORAND_TEST_NET_GENESIS_HASH,
                  })}
                >
                  <HStack alignItems="center" w="full">
                    <Text color={defaultTextColor} size="sm">
                      Connect to Algorand
                    </Text>

                    {renderNetworkTag()}
                  </HStack>
                </MenuItem>

                <MenuItem
                  onClick={handleConnect({
                    connectionType,
                    genesisHash: VOI_TEST_NET_GENESIS_HASH,
                  })}
                >
                  <HStack alignItems="center" w="full">
                    <Text color={defaultTextColor} size="sm">
                      Connect to Voi
                    </Text>

                    {renderNetworkTag()}
                  </HStack>
                </MenuItem>
              </MenuGroup>

              {dividerElement}
            </Fragment>
          );
        })}

        <MenuDivider />

        <MenuItem onClick={handleDisconnect}>
          <Text color={defaultTextColor} size="sm" w="full">
            Disconnect
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConnectMenu;
