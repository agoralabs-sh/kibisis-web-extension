import {
  Center,
  ChakraProvider,
  CreateToastFnReturn,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  useToast,
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
  WalletProvider,
} from '@txnlab/use-wallet';
import { Web3ModalSign } from '@web3modal/sign-react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import algosdk from 'algosdk';

// components
import ApplicationActionsTab from '../ApplicationActionsTab';
import AssetActionsTab from '../AssetActionsTab';
import AtomicTransactionActionsTab from '../AtomicTransactionActionsTab';
import ConnectMenu, {
  CustomUseWalletProvider,
  IConnectResult,
} from '../ConnectMenu';
import EnabledAccountsTable from '../EnabledAccountsTable';
import KeyRegistrationActionsTab from '../KeyRegistrationActionsTab';
import PaymentActionsTab from '../PaymentActionsTab';
import SignDataTab from '../SignDataTab';
import SignJwtTab from '../SignJwtTab';

// constants
import { DEFAULT_GAP } from '@extension/constants';
import { ICON_URI } from '../../constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

const App: FC = () => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const providers: SupportedProviders | null = useInitializeProviders({
    providers: [
      {
        id: PROVIDER_ID.CUSTOM,
        clientOptions: {
          name: 'Kibisis',
          icon: ICON_URI,
          getProvider: ({ algod, algosdkStatic }) =>
            new CustomUseWalletProvider(algosdkStatic ?? algosdk, algod),
        },
      },
    ],
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
  const onConnectProvider = ({
    accounts,
    connectionType,
    network,
  }: IConnectResult) => {
    setEnabledAccounts(accounts);
    setConnectionType(connectionType);
    setSelectedNetwork(network);
  };
  const onResetProvider = () => {
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
    <WalletProvider value={providers}>
      <ChakraProvider theme={theme}>
        {/*wallet connect modal*/}
        <Web3ModalSign
          metadata={{
            description: 'The Kibisis dApp example',
            icons: [
              `${window.location.protocol}//${window.location.host}/favicon.png`,
            ],
            name: document.title,
            url: 'https://kibis.is',
          }}
          modalOptions={{
            explorerRecommendedWalletIds: 'NONE',
          }}
          projectId={__WALLET_CONNECT_PROJECT_ID__}
        />

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
                  onConnect={onConnectProvider}
                  onReset={onResetProvider}
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
                </TabList>

                <TabPanels>
                  <PaymentActionsTab
                    account={selectedAccount}
                    network={selectedNetwork}
                    toast={toast}
                  />

                  <AssetActionsTab
                    account={selectedAccount}
                    network={selectedNetwork}
                    toast={toast}
                  />

                  <AtomicTransactionActionsTab
                    account={selectedAccount}
                    network={selectedNetwork}
                    toast={toast}
                  />

                  <ApplicationActionsTab
                    account={selectedAccount}
                    network={selectedNetwork}
                    toast={toast}
                  />

                  <KeyRegistrationActionsTab
                    account={selectedAccount}
                    network={selectedNetwork}
                    toast={toast}
                  />

                  <SignDataTab account={selectedAccount} toast={toast} />

                  <SignJwtTab account={selectedAccount} toast={toast} />
                </TabPanels>
              </Tabs>
            </VStack>
          </Flex>
        </Center>
      </ChakraProvider>
    </WalletProvider>
  );
};

export default App;
