import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { CUSTOM_NODES_ROUTE } from '@extension/constants';

// pages
import AdvancedSettingsPage from '@extension/pages/AdvancedSettingsPage';
import CustomNodesPage from '@extension/pages/CustomNodesPage';

const AdvancedSettingsRouter: FC = () => (
  <Routes>
    <Route element={<AdvancedSettingsPage />} path="/" />
    <Route element={<CustomNodesPage />} path={CUSTOM_NODES_ROUTE} />
  </Routes>
);

export default AdvancedSettingsRouter;
