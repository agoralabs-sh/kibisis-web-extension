import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Constants
import { ADVANCED_ROUTE } from '../../constants';

// Components
import MainLayout from '../../components/MainLayout';
import MainPageShell from '../../components/MainPageShell';

// Pages
import AdvancedSettingsPage from '../AdvancedSettingsPage';
import MainSettingsPage from '../MainSettingsPage';

const SettingsRouter: FC = () => (
  <MainPageShell>
    <MainLayout>
      <Routes>
        <Route element={<MainSettingsPage />} path="/" />
        <Route element={<AdvancedSettingsPage />} path={ADVANCED_ROUTE} />
      </Routes>
    </MainLayout>
  </MainPageShell>
);

export default SettingsRouter;
