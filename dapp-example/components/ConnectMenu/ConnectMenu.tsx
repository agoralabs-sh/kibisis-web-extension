import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
} from '@agoralabs-sh/algorand-provider';
import {
  CreateToastFnReturn,
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
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import {
  Provider,
  PROVIDER_ID,
  useWallet as useUseWallet,
} from '@txnlab/use-wallet';

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
import type { IWindow } from '@external/types';
import type { IAccountInformation } from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export interface IConnectResult {
  accounts: IAccountInformation[];
  connectionType: ConnectionTypeEnum | null;
  network: INetwork;
}

interface IProps {
  onConnect: (result: IConnectResult) => void;
  onReset: () => void;
}

const ConnectMenu: FC<IProps> = ({ onConnect, onReset }: IProps) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const { connectedAccounts, providers } = useUseWallet();
  // state
  const [useWalletNetwork, setUseWalletNetwork] = useState<INetwork | null>(
    null
  );
  // handlers
  const handleConnectViaAlgorandProvider =
    (genesisHash: string) => async () => {
      const algorand: AlgorandProvider | undefined = (window as IWindow)
        .algorand;
      let accounts: IAccountInformation[];
      let network: INetwork | null;

      if (!algorand) {
        toast({
          description:
            'Algorand Provider has been intialized; there is no supported wallet',
          status: 'error',
          title: 'window.algorand not found!',
        });

        return;
      }

      try {
        const result: IBaseResult & IEnableResult = await algorand.enable({
          genesisHash,
        });

        network =
          networks.find((value) => value.genesisHash === result.genesisHash) ||
          null;

        if (!network) {
          throw new Error(`unknown network "${result.genesisId}"`);
        }

        accounts = await Promise.all(
          result.accounts.map<Promise<IAccountInformation>>((account) =>
            getAccountInformation(account, network as INetwork)
          )
        );

        onConnect({
          accounts,
          connectionType: ConnectionTypeEnum.AlgorandProvider,
          network,
        });

        toast({
          description: `Successfully connected to "${result.id}".`,
          status: 'success',
          title: 'Connected!',
        });
      } catch (error) {
        toast({
          description: (error as BaseError).message,
          status: 'error',
          title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
        });
      }
    };
  const handleConnectViaUseWallet = async () => {
    const provider: Provider | null =
      providers?.find((value) => value.metadata.id === PROVIDER_ID.KIBISIS) ||
      null;
    let network: INetwork | null;

    if (!provider) {
      toast({
        status: 'error',
        title: `Use Wallet Provider Not Initialized`,
      });

      return;
    }

    network =
      networks.find(
        (value) => value.genesisHash === ALGORAND_TEST_NET_GENESIS_HASH
      ) || null;

    if (!network) {
      toast({
        description: `Network "${ALGORAND_TEST_NET_GENESIS_HASH}" not found`,
        status: 'error',
        title: `Unknown Network`,
      });

      return;
    }

    if (provider.isConnected) {
      setUseWalletNetwork(null);

      await provider.disconnect();
    }

    setUseWalletNetwork(network);

    await provider.connect();
  };
  const handleReset = async () => {
    setUseWalletNetwork(null);
    onReset();
  };
  // renders
  const renderNetworkTag = () => (
    <Tag colorScheme="yellow" size="sm" variant="subtle">
      <TagLabel>TestNet</TagLabel>
    </Tag>
  );

  useEffect(() => {
    if (useWalletNetwork) {
      (async () => {
        onConnect({
          accounts: await Promise.all(
            connectedAccounts.map<Promise<IAccountInformation>>(
              ({ address, name }) =>
                getAccountInformation({ address, name }, useWalletNetwork)
            )
          ),
          connectionType: ConnectionTypeEnum.UseWallet,
          network: useWalletNetwork,
        });
      })();
    }
  }, [connectedAccounts]);

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
        <MenuGroup title="@agoralabs-sh/algorand-provider">
          <MenuItem
            onClick={handleConnectViaAlgorandProvider(
              ALGORAND_TEST_NET_GENESIS_HASH
            )}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>

          <MenuItem
            onClick={handleConnectViaAlgorandProvider(
              VOI_TEST_NET_GENESIS_HASH
            )}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Voi</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuGroup title="@txnlab/use-wallet">
          <MenuItem onClick={handleConnectViaUseWallet}>
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuItem onClick={handleReset}>
          <Text size="sm" w="full">
            Reset Connection
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConnectMenu;
