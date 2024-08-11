import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { CUSTOM_NETWORKS_ROUTE } from '@extension/constants';

// pages
import CustomNetworksPage from '@extension/pages/CustomNetworksPage';
import GeneralSettingsPage from '@extension/pages/GeneralSettingsPage';

const GeneralSettingsRouter: FC = () => (
  <Routes>
    <Route element={<GeneralSettingsPage />} path="/" />
    <Route element={<CustomNetworksPage />} path={CUSTOM_NETWORKS_ROUTE} />
  </Routes>
);

export default GeneralSettingsRouter;
