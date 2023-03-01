import { ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';

// Components
import Fonts from '../Fonts';
import PopupShell from '../PopupShell';

// Theme
import { theme } from '../../theme';

const PopupApp: FC = () => (
  <ChakraProvider theme={theme}>
    <Fonts />
    <PopupShell>
      <div>Hello human!</div>
    </PopupShell>
  </ChakraProvider>
);

export default PopupApp;
