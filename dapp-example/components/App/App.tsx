import { ChakraProvider } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';

// components
import Root from '../Root';

// contexts
import SystemContext from '../../contexts/SystemContext';

// theme
import { theme } from '@extension/theme';

// utils
import createLogger from '@common/utils/createLogger';

const App: FC = () => {
  // states
  const logger = useMemo(() => createLogger('debug'), []);

  return (
    <SystemContext.Provider value={{ logger }}>
      <ChakraProvider
        theme={{
          ...theme,
          fonts: {
            body: 'Nunito',
            heading: 'Nunito',
          },
          initialColorMode: 'light',
          useSystemColorMode: true,
        }}
      >
        <Root />
      </ChakraProvider>
    </SystemContext.Provider>
  );
};

export default App;
