import { ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';

import Root from '../Root';

// theme
import { theme } from '@extension/theme';

const App: FC = () => {
  return (
    <ChakraProvider
      theme={{
        ...theme,
        fonts: {
          body: 'Nunito',
          heading: 'Nunito',
        },
      }}
    >
      <Root />
    </ChakraProvider>
  );
};

export default App;
