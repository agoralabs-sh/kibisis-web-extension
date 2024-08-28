import { ChakraProvider } from '@chakra-ui/react';
import {
  PROVIDER_ID,
  SupportedProviders,
  useInitializeProviders,
  WalletProvider as UseWalletProvider,
} from '@txnlab/use-wallet';
import React, { FC } from 'react';

import Root from '../Root';

// theme
import { theme } from '@extension/theme';

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

  return (
    <UseWalletProvider value={providers}>
      <ChakraProvider
        theme={{
          ...theme,
          font: {
            body: 'Nunito',
            heading: 'Nunito',
          },
        }}
      >
        <Root />
      </ChakraProvider>
    </UseWalletProvider>
  );
};

export default App;
