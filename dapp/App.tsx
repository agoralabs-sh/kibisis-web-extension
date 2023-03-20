import { IEnableResult } from '@agoralabs-sh/algorand-provider';
import {
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// Components
import Button from '../src/components/Button';
import Fonts from '../src/components/Fonts';

// Theme
import { theme } from '../src/theme';

// Types
import { IWindow } from '../src/types';

const App: FC = () => {
  const handleEnableClick = async () => {
    if ((window as IWindow).algorand) {
      const result: IEnableResult = await (window as IWindow).algorand.enable({
        genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      });

      console.log('App#handleEnableClick(): ', result);
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
          maxW={500}
          pt={8}
          px={8}
          w="full"
        >
          <VStack spacing={8} w="full">
            <VStack justifyContent="center" spacing={3} w="full">
              <Heading color="gray.500" textAlign="center">
                Agora Wallet DApp Example
              </Heading>
              <Text color="gray.400">Select an operation:</Text>
            </VStack>
            <VStack spacing={3} w="full">
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
