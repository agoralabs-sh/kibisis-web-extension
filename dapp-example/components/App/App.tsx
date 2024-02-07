import {
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  VStack,
  HStack,
  Text,
  Select,
  Spacer,
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
import ConnectMenu, { IConnectResult } from '../ConnectMenu';
import EnabledAccountsTable from '../EnabledAccountsTable';
import ImportAccountTab from '../ImportAccountTab';
import KeyRegistrationActionsTab from '../KeyRegistrationActionsTab';
import PaymentActionsTab from '../PaymentActionsTab';
import SignDataTab from '../SignDataTab';
import SignJwtTab from '../SignJwtTab';

// constants
import { ICON_URI } from '@common/constants';
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

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
  const handleConnectProvider = ({
    accounts,
    connectionType,
    network,
  }: IConnectResult) => {
    setEnabledAccounts(accounts);
    setConnectionType(connectionType);
    setSelectedNetwork(network);
  };
  const handleResetProvider = () => {
    setEnabledAccounts([]);
    setConnectionType(null);
    setSelectedNetwork(null);
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
                  onConnect={handleConnectProvider}
                  onReset={handleResetProvider}
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
