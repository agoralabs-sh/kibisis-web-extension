import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import {
  CHANGE_PASSWORD_ROUTE,
  VIEW_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// pages
import ChangePasswordPage from '@extension/pages/ChangePasswordPage';
import SecuritySettingsIndexPage from '@extension/pages/SecuritySettingsIndexPage';
import ViewSeedPhrasePage from '@extension/pages/ViewSeedPhrasePage';

const SecuritySettingsRouter: FC = () => (
  <Routes>
    <Route element={<SecuritySettingsIndexPage />} path="/" />
    <Route element={<ChangePasswordPage />} path={CHANGE_PASSWORD_ROUTE} />
    <Route element={<ViewSeedPhrasePage />} path={VIEW_SEED_PHRASE_ROUTE} />
  </Routes>
);

export default SecuritySettingsRouter;
