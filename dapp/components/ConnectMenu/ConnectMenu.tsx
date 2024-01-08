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
import React, { FC } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { SessionTypes } from '@walletconnect/types';
import { useConnect } from '@web3modal/sign-react';

// components
import WalletConnectIcon from '@extension/components/WalletConnectIcon';

// config
import { networks } from '@extension/config';

// enums
import { ConnectionTypeEnum } from '../../enums';

// types
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation } from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export interface IConnectResult {
  accounts: IAccountInformation[];
  connectionType: ConnectionTypeEnum;
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
  const { connect } = useConnect({
    optionalNamespaces: {
      // testnets
      algorand: {
        chains: ['algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe'],
        events: [],
        methods: ['algorand_signTransaction', 'algorand_signMessage'],
      },
      voi: {
        chains: ['voi:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu'],
        events: [],
        methods: ['voi_signTransaction', 'voi_signMessage'],
      },
    },
  });
  const { providers } = useWallet();
  // misc
  const algorandTestNetGenesisHash: string =
    'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
  const voiTestNetGenesisHash: string =
    'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=';
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
  const handleConnectViaUseWallet = (genesisHash: string) => async () => {
    console.log(providers);
  };
  const handleWalletConnect = async () => {
    const data: SessionTypes.Struct = await connect();

    console.log(data);
  };
  const handleReset = () => onReset();
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
        <MenuGroup title="@agoralabs-sh/algorand-provider">
          <MenuItem
            onClick={handleConnectViaAlgorandProvider(
              algorandTestNetGenesisHash
            )}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>

          <MenuItem
            onClick={handleConnectViaAlgorandProvider(voiTestNetGenesisHash)}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Voi</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuGroup title="@txnlab/use-wallet">
          <MenuItem
            onClick={handleConnectViaUseWallet(algorandTestNetGenesisHash)}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>

          <MenuItem onClick={handleConnectViaUseWallet(voiTestNetGenesisHash)}>
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Voi</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuItem onClick={handleWalletConnect}>
          <HStack justifyContent="space-between" w="full">
            <Text size="sm">Connect via WalletConnect v2</Text>

            <WalletConnectIcon />
          </HStack>
        </MenuItem>

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
