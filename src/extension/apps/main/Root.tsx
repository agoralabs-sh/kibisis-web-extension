import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// components
import ConfirmModal from '@extension/components/ConfirmModal';
import EnableModal from '@extension/components/EnableModal';
import ErrorModal from '@extension/components/ErrorModal';
import MainLayout from '@extension/components/MainLayout';
import SendAssetModal from '@extension/components/SendAssetModal';
import SignBytesModal from '@extension/components/SignBytesModal';
import SignTxnsModal from '@extension/components/SignTxnsModal';
import WalletConnectModal from '@extension/components/WalletConnectModal';

// features
import {
  fetchAccountsFromStorageThunk,
  startPollingForAccountInformationThunk,
} from '@extension/features/accounts';
import { fetchArc200AssetsFromStorageThunk } from '@extension/features/arc200-assets';
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/events';
import {
  fetchTransactionParamsFromStorageThunk,
  startPollingForTransactionsParamsThunk,
} from '@extension/features/networks';
import { reset as resetSendAsset } from '@extension/features/send-assets';
import {
  closeWalletConnectModal,
  fetchSessionsThunk,
  initializeWalletConnectThunk,
} from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';
import {
  fetchStandardAssetsFromStorageThunk,
  updateStandardAssetInformationThunk,
} from '@extension/features/standard-assets';
import { setConfirm, setError, setNavigate } from '@extension/features/system';

// hooks
import useOnMainAppMessage from '@extension/hooks/useOnMainAppMessage';
import useOnNetworkConnectivity from '@extension/hooks/useOnNetworkConnectivity';
import useNotifications from '@extension/hooks/useNotifications';

// selectors
import {
  useSelectAccounts,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAccountInformation,
  IAppThunkDispatch,
  IStandardAsset,
  IStandardAssetHolding,
  INetwork,
} from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  // hooks
  const accounts: IAccount[] = useSelectAccounts();
  const assets: IStandardAsset[] = useSelectStandardAssetsBySelectedNetwork();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // handlers
  const handleConfirmClose = () => dispatch(setConfirm(null));
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));
  const handleErrorModalClose = () => dispatch(setError(null));
  const handleSendAssetModalClose = () => dispatch(resetSendAsset());
  const handleSignBytesModalClose = () => dispatch(setSignBytesRequest(null));
  const handleSignTxnsModalClose = () => dispatch(setSignTxnsRequest(null));
  const handleWalletConnectModalClose = () =>
    dispatch(closeWalletConnectModal());

  // 1. fetched required data from storage
  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());
    dispatch(fetchArc200AssetsFromStorageThunk());
    dispatch(initializeWalletConnectThunk());
    dispatch(startPollingForAccountInformationThunk());
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
  // whenever the accounts are updated, check if any new assets exist in the account
  useEffect(() => {
    if (accounts.length > 0 && assets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash: string = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation: IAccountInformation | null =
          account.networkInformation[encodedGenesisHash] || null;
        let newAssets: IStandardAssetHolding[];

        if (accountInformation) {
          // filter out any new assets
          newAssets = accountInformation.standardAssetHoldings.filter(
            (assetHolding) =>
              !assets.some((value) => value.id === assetHolding.id)
          );

          // if we have any new assets, update the information
          if (newAssets.length > 0) {
            dispatch(
              updateStandardAssetInformationThunk({
                ids: newAssets.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);
  useNotifications(); // handle notifications
  useOnNetworkConnectivity(); // listen to network connectivity
  useOnMainAppMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ConfirmModal onClose={handleConfirmClose} />
      <EnableModal onClose={handleEnableModalClose} />
      <SignTxnsModal onClose={handleSignTxnsModalClose} />
      <SignBytesModal onClose={handleSignBytesModalClose} />
      <SendAssetModal onClose={handleSendAssetModalClose} />
      <WalletConnectModal onClose={handleWalletConnectModalClose} />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
