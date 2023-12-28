import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import {
  ABOUT_ROUTE,
  ADVANCED_ROUTE,
  APPEARANCE_ROUTE,
  GENERAL_ROUTE,
  SECURITY_ROUTE,
  SESSIONS_ROUTE,
} from '@extension/constants';

// pages
import AboutSettingsPage from '@extension/pages/AboutSettingsPage';
import AdvancedSettingsPage from '@extension/pages/AdvancedSettingsPage';
import AppearanceSettingsPage from '@extension/pages/AppearanceSettingsPage';
import GeneralSettingsPage from '@extension/pages/GeneralSettingsPage';
import SettingsIndexPage from '@extension/pages/SettingsIndexPage';
import SessionsSettingsPage from '@extension/pages/SessionsSettingsPage';

// routers
import SecuritySettingsRouter from '@extension/routers/SecuritySettingsRouter';

const SettingsRouter: FC = () => (
  <Routes>
    <Route element={<SettingsIndexPage />} path="/" />
    <Route element={<GeneralSettingsPage />} path={GENERAL_ROUTE} />
    <Route element={<SecuritySettingsRouter />} path={`${SECURITY_ROUTE}/*`} />
    <Route element={<AppearanceSettingsPage />} path={APPEARANCE_ROUTE} />
    <Route element={<SessionsSettingsPage />} path={SESSIONS_ROUTE} />
    <Route element={<AdvancedSettingsPage />} path={ADVANCED_ROUTE} />
    <Route element={<AboutSettingsPage />} path={ABOUT_ROUTE} />
  </Routes>
);

export default SettingsRouter;
