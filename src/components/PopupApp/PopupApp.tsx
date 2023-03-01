import { ChakraProvider } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';

// Components
import Fonts from '../Fonts';
import PopupShell from '../PopupShell';

// Theme
import { theme } from '../../theme';

const PopupApp: FC = () => {
  useEffect( () => {
    browser.tabs.create({
      url: 'onboard.html',
    });
    window.close();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <PopupShell>
        <div>Hello human!</div>
      </PopupShell>
    </ChakraProvider>
  );
}

export default PopupApp;
