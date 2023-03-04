import { ChakraProvider } from '@chakra-ui/react';
import { i18n } from 'i18next';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// Components
import Fonts from '../Fonts';
import GetStartedPage from '../GetStartedPage';
import PopupShell from '../PopupShell';

// Theme
import { theme } from '../../theme';

// Utils
import { makeStore } from '../../utils';

interface IProps {
  i18next: i18n;
}

const App: FC<IProps> = ({ i18next }: IProps) => (
  <Provider store={makeStore()}>
    <I18nextProvider i18n={i18next}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <PopupShell>
          <GetStartedPage />
        </PopupShell>
      </ChakraProvider>
    </I18nextProvider>
  </Provider>
)

export default App;
