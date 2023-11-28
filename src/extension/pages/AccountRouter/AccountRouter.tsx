import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { ASSETS_ROUTE, TRANSACTIONS_ROUTE } from '@extension/constants';

// pages
import AccountPage from '@extension/pages/AccountPage';
import AssetPage from '@extension/pages/AssetPage';
import TransactionPage from '@extension/pages/TransactionPage';

const AccountRouter: FC = () => (
  <Routes>
    <Route element={<AccountPage />} path="/" />
    <Route element={<AccountPage />} path="/:address" />
    <Route element={<AssetPage />} path={`/:address${ASSETS_ROUTE}/:assetId`} />
    <Route
      element={<TransactionPage />}
      path={`/:address${TRANSACTIONS_ROUTE}/:transactionId`}
    />
  </Routes>
);

export default AccountRouter;
