import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  NavigateFunction,
  Outlet,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

// components
import MainLayout from '@extension/components/MainLayout';

// constants
import { PASSWORD_LOCK_ROUTE } from '@extension/constants';

// features
import { reset as resetAddAsset } from '@extension/features/add-asset';
import {
  fetchAccountsFromStorageThunk,
  startPollingForAccountsThunk,
} from '@extension/features/accounts';
import { fetchARC0072AssetsFromStorageThunk } from '@extension/features/arc0072-assets';
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc0200-assets';
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/events';
import {
  fetchTransactionParamsFromStorageThunk,
  startPollingForTransactionsParamsThunk,
} from '@extension/features/networks';
import { reset as resetRemoveAssets } from '@extension/features/remove-assets';
import { reset as resetSendAsset } from '@extension/features/send-assets';
import {
  closeWalletConnectModal,
  fetchSessionsThunk,
  initializeWalletConnectThunk,
} from '@extension/features/sessions';
import { fetchSettingsFromStorageThunk } from '@extension/features/settings';
import { fetchStandardAssetsFromStorageThunk } from '@extension/features/standard-assets';
import {
  setConfirmModal,
  setScanQRCodeModal,
} from '@extension/features/system';

// hooks
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';
import useOnMainAppMessage from '@extension/hooks/useOnMainAppMessage';
import useOnNetworkConnectivity from '@extension/hooks/useOnNetworkConnectivity';
import useOnNewAssets from '@extension/hooks/useOnNewAssets';
import useNotifications from '@extension/hooks/useNotifications';

// modals
import AddAssetModal from '@extension/modals/AddAssetModal';
import ConfirmModal from '@extension/modals/ConfirmModal';
import EnableModal from '@extension/modals/EnableModal';
import RemoveAssetsModal from '@extension/modals/RemoveAssetsModal';
import ScanQRCodeModal from '@extension/modals/ScanQRCodeModal';
import SendAssetModal from '@extension/modals/SendAssetModal';
import SignBytesModal from '@extension/modals/SignBytesModal';
import SignTxnsModal from '@extension/modals/SignTxnsModal';
import WalletConnectModal from '@extension/modals/WalletConnectModal';

// selectors
import {
  useSelectAccounts,
  useSelectPasswordLockPassword,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAppThunkDispatch,
  INetwork,
  ISettings,
} from '@extension/types';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  // handlers
  const handleAddAssetModalClose = () => dispatch(resetAddAsset());
  const handleConfirmClose = () => dispatch(setConfirmModal(null));
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));
  const handleRemoveAssetsModalClose = () => dispatch(resetRemoveAssets());
  const handleScanQRCodeModalClose = () => dispatch(setScanQRCodeModal(null));
  const handleSendAssetModalClose = () => dispatch(resetSendAsset());
  const handleSignBytesModalClose = () => dispatch(setSignBytesRequest(null));
  const handleSignTxnsModalClose = () => dispatch(setSignTxnsRequest(null));
  const handleWalletConnectModalClose = () =>
    dispatch(closeWalletConnectModal());

  // 1. fetch the required data
  useEffect(() => {
    dispatch(fetchSettingsFromStorageThunk());
    dispatch(fetchSessionsThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());
    dispatch(fetchARC0072AssetsFromStorageThunk());
    dispatch(fetchARC0200AssetsFromStorageThunk());
    dispatch(initializeWalletConnectThunk());
    dispatch(startPollingForAccountsThunk());
    dispatch(startPollingForTransactionsParamsThunk());
  }, []);
  // 2. when the selected network has been fetched from storage
  useEffect(() => {
    if (selectedNetwork) {
      // fetch accounts when no accounts exist
      if (accounts.length < 1) {
        dispatch(
          fetchAccountsFromStorageThunk({
            updateInformation: true,
            updateTransactions: true,
          })
        );
      }

      // fetch the most recent transaction params for the selected network
      dispatch(fetchTransactionParamsFromStorageThunk());
    }
  }, [selectedNetwork]);
  // when the password lock is updated, if it is empty and the password lock is enabled, lock the screen
  useEffect(() => {
    if (settings.security.enablePasswordLock && !passwordLockPassword) {
      navigate(PASSWORD_LOCK_ROUTE);
    }
  }, [passwordLockPassword]);
  useOnDebugLogging();
  useOnNewAssets(); // handle new assets added
  useNotifications(); // handle notifications
  useOnNetworkConnectivity(); // listen to network connectivity
  useOnMainAppMessage(); // handle incoming messages

  return (
    <>
      <ConfirmModal onClose={handleConfirmClose} />
      <EnableModal onClose={handleEnableModalClose} />
      <SignTxnsModal onClose={handleSignTxnsModalClose} />
      <SignBytesModal onClose={handleSignBytesModalClose} />
      <AddAssetModal onClose={handleAddAssetModalClose} />
      <RemoveAssetsModal onClose={handleRemoveAssetsModalClose} />
      <SendAssetModal onClose={handleSendAssetModalClose} />
      <ScanQRCodeModal onClose={handleScanQRCodeModalClose} />
      <WalletConnectModal onClose={handleWalletConnectModalClose} />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
