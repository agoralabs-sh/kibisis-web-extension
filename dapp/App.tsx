import {
  BaseError,
  IBaseResult,
  IEnableResult,
  IWalletAccount,
} from '@agoralabs-sh/algorand-provider';
import {
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
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';

// Components
import Button from '../src/components/Button';
import Fonts from '../src/components/Fonts';

// Tabs
import SignDataTab from './SignDataTab';
import SignJwtTab from './SignJwtTab';

// Theme
import { theme } from '../src/theme';

// Types
import { IWindow } from '../src/types';

const App: FC = () => {
  const toast: CreateToastFnReturn = useToast();
  const [enabledAccounts, setEnabledAccounts] = useState<IWalletAccount[]>([]);
  const [genesisId, setGenesisId] = useState<string | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const handleEnableComplete = (enabledResult: IEnableResult) => {
    setEnabledAccounts(enabledResult.accounts);
    setGenesisId(enabledResult.genesisId);
    setGenesisHash(enabledResult.genesisHash);
  };
  const handleEnableClick = (genesisHash: string) => async () => {
    if (!(window as IWindow).algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'window.algorand not found!',
      });

      return;
    }

    try {
      const result: IBaseResult & IEnableResult = await (
        window as IWindow
      ).algorand.enable({ genesisHash });

      toast({
        description: `Successfully connected to "${result.id}".`,
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: 'Connected!',
      });

      setEnabledAccounts(result.accounts);
      setGenesisHash(result.genesisHash);
      setGenesisId(result.genesisId);
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });
    }
  };

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
          pt={8}
          px={8}
          w="full"
        >
          <VStack justifyContent="center" spacing={8} w="full">
            <Heading color="gray.500" textAlign="center">
              Agora Wallet DApp Example
            </Heading>
            <TableContainer
              borderColor="gray.200"
              borderRadius={15}
              borderStyle="solid"
              borderWidth={1}
              w="full"
            >
              <Table variant="simple">
                <TableCaption>Network: {genesisId || 'N/A'}</TableCaption>
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
            <HStack justifyContent="center" spacing={2} w="full">
              <Button
                colorScheme="primary"
                minW={250}
                onClick={handleEnableClick(
                  'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=' // algorand testnet
                )}
                size="lg"
              >
                Enable Algorand TestNet
              </Button>
              <Button
                colorScheme="primary"
                minW={250}
                onClick={handleEnableClick(
                  'xK6y2kD4Rnq9EYD1Ta1JTf56TBQTu2/zGwEEcg3C8Gg=' // voi testnet
                )}
                size="lg"
              >
                Enable Voi TestNet
              </Button>
            </HStack>
            <Tabs w="full">
              <TabList>
                <Tab>Sign Data</Tab>
                <Tab>Sign JWT</Tab>
              </TabList>
              <TabPanels>
                <SignDataTab
                  enabledAccounts={enabledAccounts}
                  genesisHash={genesisHash}
                  toast={toast}
                />
                <SignJwtTab
                  enabledAccounts={enabledAccounts}
                  genesisHash={genesisHash}
                  toast={toast}
                />
              </TabPanels>
            </Tabs>
          </VStack>
        </Flex>
      </Center>
    </ChakraProvider>
  );
};

export default App;
