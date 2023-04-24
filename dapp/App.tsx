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
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

// Components
import Fonts from '@extension/components/Fonts';

// Config
import { networks } from '@extension/config';

// Tabs
import SignAppTxnTab from './SignAppTxnTab';
import SignDataTab from './SignDataTab';
import SignJwtTab from './SignJwtTab';
import SignTxnTab from './SignTxnTab';
import SignTxnsTab from './SignTxnsTab';

// Theme
import { theme } from '@extension/theme';

// Types
import { IWindow } from '@external/types';
import { INetwork } from '@extension/types';
import { IAccountInformation, IAssetInformation } from './types';

// Utils
import { getAccountInformation } from './utils';

const App: FC = () => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
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

  useEffect(() => {
    if (enabledAccounts) {
      setSelectedAccount(enabledAccounts[0] || null);
    }
  }, [enabledAccounts]);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
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
                  {enabledAccounts.map((value) => (
                    <Tr key={nanoid()}>
                      <Td>{value.address}</Td>
                      <Td>{value.name || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {/* Enable CTAs */}
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
                  'xK6y2kD4Rnq9EYD1Ta1JTf56TBQTu2/zGwEEcg3C8Gg=' // voi testnet
                )}
                size="lg"
              >
                Enable Voi TestNet
              </Button>
            </HStack>
            {/* Select address */}
            <HStack spacing={2} w="full">
              <Text>Address:</Text>
              <Select
                onChange={handleAddressSelect}
                placeholder="Select an address"
                value={selectedAccount?.address || undefined}
              >
                {enabledAccounts.map((value) => (
                  <option key={nanoid()} value={value.address}>
                    {value.address}
                  </option>
                ))}
              </Select>
            </HStack>
            <Tabs colorScheme="primaryLight" w="full">
              <TabList>
                <Tab>Asset/Payment Txn</Tab>
                <Tab>Atomic Txns</Tab>
                <Tab>App Txn</Tab>
                <Tab>Sign Bytes</Tab>
                <Tab>Sign JWT</Tab>
              </TabList>
              <TabPanels>
                <SignTxnTab
                  account={selectedAccount}
                  network={selectedNetwork}
                  toast={toast}
                />
                <SignTxnsTab
                  account={selectedAccount}
                  network={selectedNetwork}
                  toast={toast}
                />
                <SignAppTxnTab
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
