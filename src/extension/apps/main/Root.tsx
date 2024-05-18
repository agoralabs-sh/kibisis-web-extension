import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// components
import MainLayout from '@extension/components/MainLayout';

// constants
import { PASSWORD_LOCK_ROUTE } from '@extension/constants';

// features
import { reset as resetAddAsset } from '@extension/features/add-assets';
import {
  fetchAccountsFromStorageThunk,
  startPollingForAccountsThunk,
} from '@extension/features/accounts';
import { fetchARC0072AssetsFromStorageThunk } from '@extension/features/arc0072-assets';
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc0200-assets';
import {
  fetchTransactionParamsFromStorageThunk,
  startPollingForTransactionsParamsThunk,
} from '@extension/features/networks';
import { fetchFromStorageThunk as fetchNewsFromStorageThunk } from '@extension/features/news';
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
  closeCurrentWindowThunk,
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
import AddAssetsModal, {
  AddAssetsForWatchAccountModal,
} from '@extension/modals/AddAssetsModal';
import ARC0300KeyRegistrationTransactionSendEventModal from '@extension/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import ConfirmModal from '@extension/modals/ConfirmModal';
import EnableModal from '@extension/modals/EnableModal';
import RemoveAssetsModal from '@extension/modals/RemoveAssetsModal';
import ScanQRCodeModal from '@extension/modals/ScanQRCodeModal';
import SendAssetModal from '@extension/modals/SendAssetModal';
import SignMessageModal from '@extension/modals/SignMessageModal';
import SignTransactionsModal from '@extension/modals/SignTransactionsModal';
import VoiageToMainnetModal from '@extension/modals/VoiageToMainnetModal';
import WalletConnectModal from '@extension/modals/WalletConnectModal';

// selectors
import {
  useSelectAccounts,
  useSelectPasswordLockPassword,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch } from '@extension/types';

const Root: FC = () => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  // selectors
  const accounts = useSelectAccounts();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const selectedNetwork = useSelectSelectedNetwork();
  const settings = useSelectSettings();
  // handlers
  const handleAddAssetsModalClose = () => dispatch(resetAddAsset());
  const handleConfirmClose = () => dispatch(setConfirmModal(null));
  const handleRemoveAssetsModalClose = () => dispatch(resetRemoveAssets());
  const handleScanQRCodeModalClose = () => dispatch(setScanQRCodeModal(null));
  const handleSendAssetModalClose = () => dispatch(resetSendAsset());
  const handleWalletConnectModalClose = () =>
    dispatch(closeWalletConnectModal());

  // 1. fetch the required data
  useEffect(() => {
    dispatch(fetchSettingsFromStorageThunk());
    dispatch(fetchSessionsThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());
    dispatch(fetchARC0072AssetsFromStorageThunk());
    dispatch(fetchARC0200AssetsFromStorageThunk());
    dispatch(fetchNewsFromStorageThunk());
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
      {/*top-level modals*/}
      <ConfirmModal onClose={handleConfirmClose} />

      {/*event modals*/}
      <EnableModal />
      <SignMessageModal />
      <SignTransactionsModal />
      <ARC0300KeyRegistrationTransactionSendEventModal />

      {/*action modals*/}
      <AddAssetsModal onClose={handleAddAssetsModalClose} />
      <AddAssetsForWatchAccountModal onClose={handleAddAssetsModalClose} />
      <RemoveAssetsModal onClose={handleRemoveAssetsModalClose} />
      <SendAssetModal onClose={handleSendAssetModalClose} />
      <ScanQRCodeModal onClose={handleScanQRCodeModalClose} />
      <WalletConnectModal onClose={handleWalletConnectModalClose} />

      {/*information modals*/}
      <VoiageToMainnetModal />

      {/*main*/}
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
