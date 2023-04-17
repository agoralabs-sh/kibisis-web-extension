import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Constants
import { ASSETS_ROUTE } from '@extension/constants';

// Pages
import AccountPage from '@extension/pages/AccountPage';
import AssetPage from '@extension/pages/AssetPage';

const AccountRouter: FC = () => (
  <Routes>
    <Route element={<AccountPage />} path="/" />
    <Route element={<AccountPage />} path="/:address" />
    <Route element={<AssetPage />} path={`/:address${ASSETS_ROUTE}/:assetId`} />
  </Routes>
);

export default AccountRouter;
