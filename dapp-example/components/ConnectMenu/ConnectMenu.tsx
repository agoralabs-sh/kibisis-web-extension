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
import React, { FC, Fragment } from 'react';

// constants
import {
  ALGORAND_TEST_NET_GENESIS_HASH,
  VOI_TEST_NET_GENESIS_HASH,
} from '../../constants';

// config
import { networks } from '@extension/config';

// enums
import { ConnectionTypeEnum } from '../../enums';

// types
import type { INetwork } from '@extension/types';
import type { IProps, THandleConnectParams } from './types';

const ConnectMenu: FC<IProps> = ({ onConnect, onDisconnect, toast }) => {
  // handlers
  const handleConnect = (params: THandleConnectParams) => () => {
    let genesisHash: string;
    let network: INetwork | null;

    switch (params.connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
      case ConnectionTypeEnum.AVMWebProvider:
        genesisHash = params.genesisHash;
        break;
      case ConnectionTypeEnum.UseWallet:
      default:
        genesisHash = ALGORAND_TEST_NET_GENESIS_HASH; // use-wallet only supports algorand testnet
        break;
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    // if there is no known network, just error early
    if (!network) {
      toast({
        description: `Network "${genesisHash}" not found`,
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
    <Tag colorScheme="yellow" size="sm" variant="subtle">
      <TagLabel>TestNet</TagLabel>
    </Tag>
  );

  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.400' }}
        _expanded={{ bg: 'primary.400' }}
        _focus={{ boxShadow: 'outline' }}
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

          switch (connectionType) {
            case ConnectionTypeEnum.AlgorandProvider:
            case ConnectionTypeEnum.AVMWebProvider:
              return (
                <Fragment key={`connect-menu-item=${index}`}>
                  {dividerElement}

                  <MenuGroup title={connectionType}>
                    <MenuItem
                      onClick={handleConnect({
                        connectionType,
                        genesisHash: ALGORAND_TEST_NET_GENESIS_HASH,
                      })}
                    >
                      <HStack alignItems="center" w="full">
                        <Text size="sm">Connect to Algorand</Text>

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
                        <Text size="sm">Connect to Voi</Text>

                        {renderNetworkTag()}
                      </HStack>
                    </MenuItem>
                  </MenuGroup>

                  {dividerElement}
                </Fragment>
              );
            case ConnectionTypeEnum.UseWallet:
              return (
                <Fragment key={`connect-menu-item=${index}`}>
                  <MenuGroup title={connectionType}>
                    <MenuItem onClick={handleConnect({ connectionType })}>
                      <HStack alignItems="center" w="full">
                        <Text size="sm">Connect to Algorand</Text>

                        {renderNetworkTag()}
                      </HStack>
                    </MenuItem>
                  </MenuGroup>

                  {dividerElement}
                </Fragment>
              );
            default:
              return null;
          }
        })}

        <MenuItem onClick={handleDisconnect}>
          <Text size="sm" w="full">
            Disconnect
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConnectMenu;
