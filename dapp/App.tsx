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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';

// Components
import Button from '../src/components/Button';
import Fonts from '../src/components/Fonts';

// Theme
import { theme } from '../src/theme';

// Types
import { IWindow } from '../src/types';

const App: FC = () => {
  const toast: CreateToastFnReturn = useToast();
  const [authorizedAccounts, setAuthorizedAccounts] = useState<
    IWalletAccount[]
  >([]);
  const [genesisId, setGenesisId] = useState<string | null>(null);
  const handleEnableClick = async () => {
    if ((window as IWindow).algorand) {
      try {
        const result: IBaseResult & IEnableResult = await (
          window as IWindow
        ).algorand.enable({
          genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
        });

        toast({
          description: `Successfully connected to "${result.id}".`,
          duration: 3000,
          isClosable: true,
          status: 'success',
          title: 'Connected!',
        });

        setAuthorizedAccounts(result.accounts);
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
          maxW={1024}
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
                  {authorizedAccounts.map((value) => (
                    <Tr key={nanoid()}>
                      <Td>{value.address}</Td>
                      <Td>{value.name || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Text color="gray.400">Select an operation:</Text>
            <VStack spacing={3} w={500}>
              <Button
                colorScheme="primary"
                onClick={handleEnableClick}
                size="lg"
                w="full"
              >
                Enable
              </Button>
            </VStack>
          </VStack>
        </Flex>
      </Center>
    </ChakraProvider>
  );
};

export default App;
