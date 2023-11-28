import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// components
import ConfirmModal from '@extension/components/ConfirmModal';
import EnableModal from '@extension/components/EnableModal';
import ErrorModal from '@extension/components/ErrorModal';
import MainLayout from '@extension/components/MainLayout';
import SignBytesModal from '@extension/components/SignBytesModal';
import SignTxnsModal from '@extension/components/SignTxnsModal';
import WalletConnectModal from '@extension/components/WalletConnectModal';

// features
import {
  fetchAccountsFromStorageThunk,
  startPollingForAccountInformationThunk,
} from '@extension/features/accounts';
import {
  setConfirm,
  setError,
  setNavigate,
  setToast,
} from '@extension/features/system';
import {
  fetchAssetsThunk,
  updateAssetInformationThunk,
} from '@extension/features/assets';
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/messages';
import {
  closeWalletConnectModal,
  fetchSessionsThunk,
  initializeWalletConnectThunk,
} from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';

// hooks
import useOnMainAppMessage from '@extension/hooks/useOnMainAppMessage';
import useOnNetworkConnectivity from '@extension/hooks/useOnNetworkConnectivity';

// selectors
import {
  useSelectAccounts,
  useSelectAssets,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAccountInformation,
  IAppThunkDispatch,
  IAsset,
  IAssetHolding,
  INetwork,
} from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  // hooks
  const accounts: IAccount[] = useSelectAccounts();
  const assets: Record<string, IAsset[]> | null = useSelectAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // misc
  const { toast, ToastContainer } = createStandaloneToast({
    defaultOptions: {
      containerStyle: {
        margin: '0',
        maxWidth: '100%',
        minWidth: '100%',
        padding: '0.5rem',
        width: '100%',
      },
      duration: 6000,
      position: 'top',
    },
    theme,
  });
  // handlers
  const handleConfirmClose = () => dispatch(setConfirm(null));
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));
  const handleErrorModalClose = () => dispatch(setError(null));
  const handleSignBytesModalClose = () => dispatch(setSignBytesRequest(null));
  const handleSignTxnsModalClose = () => dispatch(setSignTxnsRequest(null));
  const handleWalletConnectModalClose = () =>
    dispatch(closeWalletConnectModal());

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
    dispatch(fetchAssetsThunk());
    dispatch(initializeWalletConnectThunk());
    dispatch(startPollingForAccountInformationThunk());
  }, []);
  // fetch accounts when the selected network has been found and no accounts exist
  useEffect(() => {
    if (selectedNetwork && accounts.length < 1) {
      dispatch(
        fetchAccountsFromStorageThunk({
          updateAccountInformation: true,
          updateAccountTransactions: true,
        })
      );
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
        let newAssets: IAssetHolding[];

        if (accountInformation) {
          // filter out any new assets
          newAssets = accountInformation.assetHoldings.filter(
            (assetHolding) =>
              !assets[encodedGenesisHash].some(
                (value) => value.id === assetHolding.id
              )
          );

          // if we have any new assets, update the information
          if (newAssets.length > 0) {
            dispatch(
              updateAssetInformationThunk({
                ids: newAssets.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);
  useOnNetworkConnectivity(); // listen to network connectivity
  useOnMainAppMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ConfirmModal onClose={handleConfirmClose} />
      <EnableModal onClose={handleEnableModalClose} />
      <SignTxnsModal onClose={handleSignTxnsModalClose} />
      <SignBytesModal onClose={handleSignBytesModalClose} />
      <WalletConnectModal onClose={handleWalletConnectModalClose} />
      <ToastContainer />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
