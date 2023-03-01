import { ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';

// Components
import Fonts from '../Fonts';
import OnboardShell from '../OnboardShell';

// Theme
import { theme } from '../../theme';

const OnboardApp: FC = () => (
  <ChakraProvider theme={theme}>
    <Fonts />
    <OnboardShell>
      <div>Hello human!</div>
    </OnboardShell>
  </ChakraProvider>
);

export default OnboardApp;
