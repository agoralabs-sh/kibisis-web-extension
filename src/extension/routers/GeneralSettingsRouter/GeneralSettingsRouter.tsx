import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { CUSTOM_NODES_ROUTE } from '@extension/constants';

// pages
import CustomNodesPage from '@extension/pages/CustomNodesPage';
import GeneralSettingsPage from '@extension/pages/GeneralSettingsPage';

const GeneralSettingsRouter: FC = () => (
  <Routes>
    <Route element={<GeneralSettingsPage />} path="/" />
    <Route element={<CustomNodesPage />} path={CUSTOM_NODES_ROUTE} />
  </Routes>
);

export default GeneralSettingsRouter;
