import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  ASSETS_ROUTE,
  NFTS_ROUTE,
  SETTINGS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '@extension/constants';

// containers
import Root from '../../Root';

// features
import { setSideBar } from '@extension/features/layout';

// pages
import AccountPage from '@extension/pages/AccountPage';
import AssetPage from '@extension/pages/AssetPage';
import NFTPage from '@extension/pages/NFTPage';
import SettingsRouter from '@extension/routers/SettingsRouter';
import TransactionPage from '@extension/pages/TransactionPage';

// routers
import AddAccountRouter from '@extension/routers/AddAccountMainRouter';

// types
import type { IOptions } from './types';

const createRouter = ({ i18n, store }: IOptions) => {
  const { dispatch } = store;

  return createHashRouter([
    {
      children: [
        {
          element: <Navigate replace={true} to={ACCOUNTS_ROUTE} />,
          path: '/',
        },
        {
          element: <AccountPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${ACCOUNTS_ROUTE}/*`,
        },
        {
          element: <AddAccountRouter />,
          loader: () => {
            dispatch(setSideBar(false));

            return null;
          },
          path: `${ADD_ACCOUNT_ROUTE}/*`,
        },
        {
          element: <AssetPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${ASSETS_ROUTE}/:assetId`,
        },
        {
          element: <NFTPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${NFTS_ROUTE}/:appId/:tokenId`,
        },
        {
          element: <SettingsRouter />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${SETTINGS_ROUTE}/*`,
        },
        {
          element: <TransactionPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${TRANSACTIONS_ROUTE}/:transactionId`,
        },
      ],
      element: <Root i18n={i18n} />,
      path: '/',
    },
  ]);
};

export default createRouter;
