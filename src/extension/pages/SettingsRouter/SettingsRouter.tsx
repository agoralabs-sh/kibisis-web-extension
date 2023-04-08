import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Constants
import {
  ADVANCED_ROUTE,
  APPEARANCE_ROUTE,
  SECURITY_ROUTE,
  SESSIONS_ROUTE,
} from '@extension/constants';

// Components
import MainLayout from '@extension/components/MainLayout';
import MainPageShell from '@extension/components/MainPageShell';

// Pages
import AdvancedSettingsPage from '../AdvancedSettingsPage';
import AppearanceSettingsPage from '../AppearanceSettingsPage';
import MainSettingsPage from '../MainSettingsPage';
import SecuritySettingsPage from '../SecuritySettingsPage';
import SessionsSettingsPage from '../SessionsSettingsPage';

const SettingsRouter: FC = () => (
  <MainPageShell>
    <MainLayout>
      <Routes>
        <Route element={<MainSettingsPage />} path="/" />
        <Route element={<SecuritySettingsPage />} path={SECURITY_ROUTE} />
        <Route element={<AppearanceSettingsPage />} path={APPEARANCE_ROUTE} />
        <Route element={<SessionsSettingsPage />} path={SESSIONS_ROUTE} />
        <Route element={<AdvancedSettingsPage />} path={ADVANCED_ROUTE} />
      </Routes>
    </MainLayout>
  </MainPageShell>
);

export default SettingsRouter;
