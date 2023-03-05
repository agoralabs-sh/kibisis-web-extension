import { ChakraProvider } from '@chakra-ui/react';
import { i18n } from 'i18next';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import SlideRoutes from 'react-slide-routes';

// Components
import Fonts from '../Fonts';

// Constants
import { CREATE_PASSWORD_ROUTE, GET_STARTED_ROUTE } from '../../constants';

// Pages
import CreatePasswordPage from '../../pages/CreatePasswordPage';
import GetStartedPage from '../../pages/GetStartedPage';

// Theme
import { theme } from '../../theme';

// Utils
import { makeStore } from '../../utils';

interface IProps {
  i18next: i18n;
}

const RegisterApp: FC<IProps> = ({ i18next }: IProps) => (
  <Provider store={makeStore()}>
    <I18nextProvider i18n={i18next}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <HashRouter>
          <SlideRoutes>
            <Route element={<GetStartedPage />} path={GET_STARTED_ROUTE} />
            <Route element={<CreatePasswordPage />} path={CREATE_PASSWORD_ROUTE} />
          </SlideRoutes>
        </HashRouter>
      </ChakraProvider>
    </I18nextProvider>
  </Provider>
)

export default RegisterApp;
