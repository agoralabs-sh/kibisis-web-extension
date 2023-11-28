import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { CHANGE_PASSWORD_ROUTE } from '@extension/constants';

// pages
import ChangePasswordPage from '@extension/pages/ChangePasswordPage';
import SecuritySettingsIndexPage from '@extension/pages/SecuritySettingsIndexPage';

const SecuritySettingsRouter: FC = () => (
  <Routes>
    <Route element={<SecuritySettingsIndexPage />} path="/" />
    <Route element={<ChangePasswordPage />} path={CHANGE_PASSWORD_ROUTE} />
  </Routes>
);

export default SecuritySettingsRouter;
