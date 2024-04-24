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
import ConnectionNotInitializedContent from '../ConnectionNotInitializedContent';
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
import type { INetwork } from '@extension/types';
import type { IAccountInformation, IBaseTransactionProps } from '../../types';

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
    enabledAccounts: algorandProviderEnabledAccounts,
    signTransactionsAction: algorandProviderSignTransactionsAction,
  } = useAlgorandProviderConnector({ toast });
  const {
    connectAction: avmWebProviderConnectAction,
    disconnectAction: avmWebProviderDisconnectAction,
    enabledAccounts: avmWebProviderEnabledAccounts,
    signTransactionsAction: avmWebProviderSignTransactionsAction,
  } = useAVMWebProviderConnector({ toast });
  const {
    connectAction: useWalletConnectAction,
    disconnectAction: useWalletDisconnectAction,
    enabledAccounts: useWalletEnabledAccounts,
    signTransactionsAction: useWalletSignTransactionsAction,
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
    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        await algorandProviderConnectAction(network);
        break;
      case ConnectionTypeEnum.AVMWebProvider:
        await avmWebProviderConnectAction(network);
        break;
      case ConnectionTypeEnum.UseWallet:
        await useWalletConnectAction(network);
        break;
      default:
        break;
    }

    setConnectionType(connectionType);
    setSelectedNetwork(network);
  };
  const handleDisconnect = async () => {
    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        await algorandProviderDisconnectAction();
        break;
      case ConnectionTypeEnum.AVMWebProvider:
        await avmWebProviderDisconnectAction();
        break;
      case ConnectionTypeEnum.UseWallet:
        await useWalletDisconnectAction();
        break;
      default:
        break;
    }

    setConnectionType(null);
    setSelectedNetwork(null);
  };
  // renders
  const renderContent = () => {
    let signTransactionProps: IBaseTransactionProps;

    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: algorandProviderSignTransactionsAction,
        };

        return (
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
              <PaymentActionsTab {...signTransactionProps} />

              <AssetActionsTab {...signTransactionProps} />

              <AtomicTransactionActionsTab {...signTransactionProps} />

              <ApplicationActionsTab {...signTransactionProps} />

              <KeyRegistrationActionsTab {...signTransactionProps} />

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
        );
      case ConnectionTypeEnum.AVMWebProvider:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: avmWebProviderSignTransactionsAction,
        };

        return (
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
              <PaymentActionsTab {...signTransactionProps} />

              <AssetActionsTab {...signTransactionProps} />

              <AtomicTransactionActionsTab {...signTransactionProps} />

              <ApplicationActionsTab {...signTransactionProps} />

              <KeyRegistrationActionsTab {...signTransactionProps} />

              <ImportAccountTab />
            </TabPanels>
          </Tabs>
        );
      case ConnectionTypeEnum.UseWallet:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: useWalletSignTransactionsAction,
        };

        return (
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
              <PaymentActionsTab {...signTransactionProps} />

              <AssetActionsTab {...signTransactionProps} />

              <AtomicTransactionActionsTab {...signTransactionProps} />

              <ApplicationActionsTab {...signTransactionProps} />

              <KeyRegistrationActionsTab {...signTransactionProps} />

              <ImportAccountTab />
            </TabPanels>
          </Tabs>
        );
      default:
        break;
    }

    return <ConnectionNotInitializedContent />;
  };

  useEffect(() => {
    switch (connectionType) {
      case ConnectionTypeEnum.AlgorandProvider:
        setEnabledAccounts(algorandProviderEnabledAccounts);
        break;
      case ConnectionTypeEnum.AVMWebProvider:
        setEnabledAccounts(avmWebProviderEnabledAccounts);
        break;
      case ConnectionTypeEnum.UseWallet:
        setEnabledAccounts(useWalletEnabledAccounts);
        break;
      default:
        setEnabledAccounts([]);
        break;
    }
  }, [
    algorandProviderEnabledAccounts,
    avmWebProviderEnabledAccounts,
    useWalletEnabledAccounts,
  ]);
  useEffect(
    () => setSelectedAccount(enabledAccounts[0] || null),
    [enabledAccounts]
  );

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
              {renderContent()}
            </VStack>
          </Flex>
        </Center>
      </ChakraProvider>
    </UseWalletProvider>
  );
};

export default App;
