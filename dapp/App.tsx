import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
} from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Center,
  ChakraProvider,
  CreateToastFnReturn,
  Flex,
  Heading,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  TabList,
  Tabs,
  TabPanels,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  Text,
  Select,
} from '@chakra-ui/react';
import { SessionTypes } from '@walletconnect/types';
import { Web3ModalSign, useConnect } from '@web3modal/sign-react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// components
import WalletConnectIcon from '@extension/components/WalletConnectIcon';

// config
import { networks } from '@extension/config';

// tabs
import ApplicationActionsTab from './ApplicationActionsTab';
import AssetActionsTab from './AssetActionsTab';
import ARC200ActionsTab from './ARC200ActionsTab';
import AtomicTransactionActionsTab from './AtomicTransactionActionsTab';
import KeyRegistrationActionsTab from './KeyRegistrationActionsTab';
import PaymentActionsTab from './PaymentActionsTab';
import SignDataTab from './SignDataTab';
import SignJwtTab from './SignJwtTab';

// theme
import { theme } from '@extension/theme';

// types
import { IWindow } from '@external/types';
import { INetwork } from '@extension/types';
import { IAccountInformation } from './types';

// utils
import { getAccountInformation } from './utils';

const App: FC = () => {
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
  // states
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountInformation | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null);
  const handleAddressSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const account: IAccountInformation | null =
      enabledAccounts.find((value) => value.address === event.target.value) ||
      null;

    if (account) {
      setSelectedAccount(account);
    }
  };
  const handleEnableClick = (genesisHash: string) => async () => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
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

      setEnabledAccounts(accounts);
      setSelectedNetwork(network);

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
  const handleWalletConnectClick = async () => {
    const data: SessionTypes.Struct = await connect();

    console.log(data);
  };

  useEffect(() => {
    if (enabledAccounts) {
      setSelectedAccount(enabledAccounts[0] || null);
    }
  }, [enabledAccounts]);

  return (
    <ChakraProvider theme={theme}>
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
        projectId="0451c3741ac5a5eba94c213ee1073cb1"
      />
      <Center as="main" backgroundColor="white">
        <Flex
          alignItems="center"
          direction="column"
          justifyContent="center"
          minH="100vh"
          maxW={800}
          px={8}
          py={8}
          w="full"
        >
          <VStack justifyContent="center" spacing={8} w="full">
            <Heading color="gray.500" textAlign="center">
              {document.title}
            </Heading>
            {/* Enabled accounts table */}
            <TableContainer
              borderColor="gray.200"
              borderRadius={15}
              borderStyle="solid"
              borderWidth={1}
              w="full"
            >
              <Table variant="simple">
                <TableCaption>
                  Network: {selectedNetwork?.genesisId || 'N/A'}
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {enabledAccounts.map((value, index) => (
                    <Tr key={`enabled-account-item-${index}`}>
                      <Td>{value.address}</Td>
                      <Td>{value.name || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Enable CTAs */}
            <VStack>
              <HStack justifyContent="center" spacing={2} w="full">
                <Button
                  borderRadius={theme.radii['3xl']}
                  colorScheme="primaryLight"
                  minW={250}
                  onClick={handleEnableClick(
                    'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=' // algorand testnet
                  )}
                  size="lg"
                >
                  Enable Algorand TestNet
                </Button>
                <Button
                  borderRadius={theme.radii['3xl']}
                  colorScheme="primaryLight"
                  minW={250}
                  onClick={handleEnableClick(
                    'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=' // voi testnet
                  )}
                  size="lg"
                >
                  Enable Voi TestNet
                </Button>
              </HStack>

              <Button
                borderRadius={theme.radii['3xl']}
                colorScheme="blue"
                minW={250}
                onClick={handleWalletConnectClick}
                rightIcon={<WalletConnectIcon />}
                size="lg"
              >
                Connect WalletConnect
              </Button>
            </VStack>
            {/* Select address */}
            <HStack spacing={2} w="full">
              <Text>Address:</Text>
              <Select
                onChange={handleAddressSelect}
                placeholder="Select an address"
                value={selectedAccount?.address || undefined}
              >
                {enabledAccounts.map((value, index) => (
                  <option key={`address-option-${index}`} value={value.address}>
                    {value.address}
                  </option>
                ))}
              </Select>
            </HStack>
            <Tabs colorScheme="primaryLight" w="full">
              <TabList>
                <Tab>Payments</Tab>
                <Tab>Assets</Tab>
                <Tab>Assets (ARC200)</Tab>
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
                <ARC200ActionsTab
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
  );
};

export default App;
