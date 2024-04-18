import {
  Center,
  ChakraProvider,
  CreateToastFnReturn,
  Flex,
  Heading,
  HStack,
  Select,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  PROVIDER_ID,
  SupportedProviders,
  useInitializeProviders,
  WalletProvider as UseWalletProvider,
} from '@txnlab/use-wallet';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// components
import ApplicationActionsTab from '../ApplicationActionsTab';
import AssetActionsTab from '../AssetActionsTab';
import AtomicTransactionActionsTab from '../AtomicTransactionActionsTab';
import ConnectMenu, { IOnConnectParams } from '../ConnectMenu';
import EnabledAccountsTable from '../EnabledAccountsTable';
import ImportAccountTab from '../ImportAccountTab';
import KeyRegistrationActionsTab from '../KeyRegistrationActionsTab';
import PaymentActionsTab from '../PaymentActionsTab';
import SignDataTab from '../SignDataTab';
import SignJwtTab from '../SignJwtTab';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useAlgorandProviderConnector from '../../hooks/useAlgorandProviderConnector';
import useAVMWebProviderConnector from '../../hooks/useAVMWebProviderConnector';
import useUseWalletConnector from '../../hooks/useUseWalletConnector';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

const App: FC = () => {
  const providers: SupportedProviders | null = useInitializeProviders({
    nodeConfig: {
      network: 'testnet',
      nodeServer: 'https://testnet-api.algonode.cloud',
      nodeToken: '',
      nodePort: '443',
    },
    providers: [{ id: PROVIDER_ID.KIBISIS }],
  });
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // hooks
  const {
    connectAction: algorandProviderConnectAction,
    disconnectAction: algorandProviderDisconnectAction,
  } = useAlgorandProviderConnector({ toast });
  const {
    connectAction: avmWebProviderConnectAction,
    disconnectAction: avmWebProviderDisconnectAction,
  } = useAVMWebProviderConnector({ toast });
  const {
    connectAction: useWalletConnectAction,
    disconnectAction: useWalletDisconnectAction,
  } = useUseWalletConnector({ toast });
  // states
  const [connectionType, setConnectionType] =
    useState<ConnectionTypeEnum | null>(null);
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountInformation | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null);
  // handlers
  const handleAddressSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const account: IAccountInformation | null =
      enabledAccounts.find((value) => value.address === event.target.value) ||
      null;

    if (account) {
      setSelectedAccount(account);
    }
  };
  const handleConnect = async ({
    connectionType,
    network,
  }: IOnConnectParams) => {
    setConnectionType(connectionType);
    setSelectedNetwork(network);

    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        return algorandProviderConnectAction(network);
      case ConnectionTypeEnum.AVMWebProvider:
        return avmWebProviderConnectAction(network);
      case ConnectionTypeEnum.UseWallet:
        return useWalletConnectAction(network);
      default:
        break;
    }
  };
  const handleDisconnect = () => {
    setConnectionType(null);
    setSelectedNetwork(null);

    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        return algorandProviderDisconnectAction();
      case ConnectionTypeEnum.AVMWebProvider:
        return avmWebProviderDisconnectAction();
      case ConnectionTypeEnum.UseWallet:
        return useWalletDisconnectAction();
      default:
        break;
    }
  };

  useEffect(() => {
    if (enabledAccounts) {
      setSelectedAccount(enabledAccounts[0] || null);
    }
  }, [enabledAccounts]);

  return (
    <UseWalletProvider value={providers}>
      <ChakraProvider theme={theme}>
        <Center as="main" backgroundColor="white">
          <Flex
            alignItems="center"
            direction="column"
            minH="100vh"
            maxW={800}
            px={DEFAULT_GAP}
            pb={DEFAULT_GAP}
            pt={DEFAULT_GAP - 2}
            w="full"
          >
            <VStack spacing={8} w="full">
              <HStack justifyContent="space-between" w="full">
                <Spacer />

                {/*title*/}
                <Heading color="gray.500" flexGrow={1} textAlign="center">
                  {document.title}
                </Heading>

                {/*connect menu*/}
                <ConnectMenu
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  toast={toast}
                />
              </HStack>

              {/*enabled accounts table*/}
              <EnabledAccountsTable
                enabledAccounts={enabledAccounts}
                connectionType={connectionType}
                network={selectedNetwork}
              />

              {/*select address*/}
              <HStack spacing={2} w="full">
                <Text>Address:</Text>
                <Select
                  onChange={handleAddressSelect}
                  placeholder="Select an address"
                  value={selectedAccount?.address || undefined}
                >
                  {enabledAccounts.map((value, index) => (
                    <option
                      key={`address-option-${index}`}
                      value={value.address}
                    >
                      {value.address}
                    </option>
                  ))}
                </Select>
              </HStack>

              {/*tabs*/}
              <Tabs colorScheme="primaryLight" w="full">
                <TabList>
                  <Tab>Payments</Tab>
                  <Tab>Assets</Tab>
                  <Tab>Atomic Txns</Tab>
                  <Tab>Apps</Tab>
                  <Tab>Keys</Tab>
                  <Tab>Sign Bytes</Tab>
                  <Tab>Sign JWT</Tab>
                  <Tab>Import Account</Tab>
                </TabList>

                <TabPanels>
                  <PaymentActionsTab
                    account={selectedAccount}
                    connectionType={connectionType}
                    network={selectedNetwork}
                  />

                  <AssetActionsTab
                    account={selectedAccount}
                    connectionType={connectionType}
                    network={selectedNetwork}
                  />

                  <AtomicTransactionActionsTab
                    account={selectedAccount}
                    connectionType={connectionType}
                    network={selectedNetwork}
                  />

                  <ApplicationActionsTab
                    account={selectedAccount}
                    connectionType={connectionType}
                    network={selectedNetwork}
                  />

                  <KeyRegistrationActionsTab
                    account={selectedAccount}
                    connectionType={connectionType}
                    network={selectedNetwork}
                  />

                  <SignDataTab
                    account={selectedAccount}
                    connectionType={connectionType}
                  />

                  <SignJwtTab
                    account={selectedAccount}
                    connectionType={connectionType}
                  />

                  <ImportAccountTab />
                </TabPanels>
              </Tabs>
            </VStack>
          </Flex>
        </Center>
      </ChakraProvider>
    </UseWalletProvider>
  );
};

export default App;
