import React, { FC, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

// components
import MainLayout from '@extension/components/MainLayout';

// features
import { reset as resetAddAsset } from '@extension/features/add-assets';
import {
  fetchAccountsFromStorageThunk,
  startPollingForAccountsThunk,
} from '@extension/features/accounts';
import { fetchARC0072AssetsFromStorageThunk } from '@extension/features/arc0072-assets';
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc0200-assets';
import { fetchActiveThunk as fetchCredentialLockActiveThunk } from '@extension/features/credential-lock';
import {
  setConfirmModal,
  setScanQRCodeModal,
} from '@extension/features/layout';
import {
  fetchTransactionParamsFromStorageThunk,
  startPollingForTransactionsParamsThunk,
} from '@extension/features/networks';
import { fetchFromStorageThunk as fetchNewsFromStorageThunk } from '@extension/features/news';
import { setShowingConfetti } from '@extension/features/notifications';
import { fetchFromStorageThunk as fetchPasskeyCredentialFromStorageThunk } from '@extension/features/passkeys';
import { reset as resetReKeyAccount } from '@extension/features/re-key-account';
import { reset as resetRemoveAssets } from '@extension/features/remove-assets';
import { reset as resetSendAsset } from '@extension/features/send-assets';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchFromStorageThunk as fetchSettingsFromStorageThunk } from '@extension/features/settings';
import { fetchStandardAssetsFromStorageThunk } from '@extension/features/standard-assets';
import {
  fetchFromStorageThunk as fetchSystemInfoFromStorageThunk,
  startPollingForNetworkConnectivityThunk,
} from '@extension/features/system';

// hooks
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';
import useOnMainAppMessage from '@extension/hooks/useOnMainAppMessage';
import useOnNewAssets from '@extension/hooks/useOnNewAssets';
import useNotifications from '@extension/hooks/useNotifications';

// modals
import AddAssetsModal, {
  AddAssetsForWatchAccountModal,
} from '@extension/modals/AddAssetsModal';
import ARC0300KeyRegistrationTransactionSendEventModal from '@extension/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import ConfirmModal from '@extension/modals/ConfirmModal';
import CredentialLockModal from '@extension/modals/CredentialLockModal';
import EnableModal from '@extension/modals/EnableModal';
import ReKeyAccountModal from '@extension/modals/ReKeyAccountModal';
import RemoveAssetsModal from '@extension/modals/RemoveAssetsModal';
import ScanQRCodeModal from '@extension/modals/ScanQRCodeModal';
import SendAssetModal from '@extension/modals/SendAssetModal';
import SignMessageModal from '@extension/modals/SignMessageModal';
import SignTransactionsModal from '@extension/modals/SignTransactionsModal';
import VoiageToMainnetModal from '@extension/modals/VoiageToMainnetModal';

// selectors
import {
  useSelectAccounts,
  useSelectNotificationsShowingConfetti,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

const Root: FC = () => {
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const accounts = useSelectAccounts();
  const network = useSelectSelectedNetwork();
  const showingConfetti = useSelectNotificationsShowingConfetti();
  // handlers
  const handleAddAssetsModalClose = () => dispatch(resetAddAsset());
  const handleConfirmClose = () => dispatch(setConfirmModal(null));
  const handleConfettiComplete = () => dispatch(setShowingConfetti(false));
  const handleReKeyAccountModalClose = () => dispatch(resetReKeyAccount());
  const handleRemoveAssetsModalClose = () => dispatch(resetRemoveAssets());
  const handleScanQRCodeModalClose = () => dispatch(setScanQRCodeModal(null));
  const handleSendAssetModalClose = () => dispatch(resetSendAsset());

  // 1. fetch the required data
  useEffect(() => {
    dispatch(fetchCredentialLockActiveThunk());
    dispatch(fetchSystemInfoFromStorageThunk());
    dispatch(fetchSettingsFromStorageThunk());
    dispatch(fetchPasskeyCredentialFromStorageThunk());
    dispatch(fetchSessionsThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());
    dispatch(fetchARC0072AssetsFromStorageThunk());
    dispatch(fetchARC0200AssetsFromStorageThunk());
    dispatch(fetchNewsFromStorageThunk());
    dispatch(startPollingForAccountsThunk());
    dispatch(startPollingForTransactionsParamsThunk());
    dispatch(startPollingForNetworkConnectivityThunk());
  }, []);
  // 2. when the selected network has been fetched from storage
  useEffect(() => {
    if (network) {
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
  }, [network]);
  useOnDebugLogging();
  useOnNewAssets(); // handle new assets added
  useNotifications(); // handle notifications
  useOnMainAppMessage(); // handle incoming messages

  return (
    <>
      {showingConfetti && (
        <Confetti onConfettiComplete={handleConfettiComplete} recycle={false} />
      )}

      {/*top-level modals*/}
      <CredentialLockModal />
      <ConfirmModal onClose={handleConfirmClose} />

      {/*event modals*/}
      <EnableModal />
      <SignMessageModal />
      <SignTransactionsModal />
      <ARC0300KeyRegistrationTransactionSendEventModal />

      {/*action modals*/}
      <AddAssetsModal onClose={handleAddAssetsModalClose} />
      <AddAssetsForWatchAccountModal onClose={handleAddAssetsModalClose} />
      <ReKeyAccountModal onClose={handleReKeyAccountModalClose} />
      <RemoveAssetsModal onClose={handleRemoveAssetsModalClose} />
      <SendAssetModal onClose={handleSendAssetModalClose} />
      <ScanQRCodeModal onClose={handleScanQRCodeModalClose} />

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
