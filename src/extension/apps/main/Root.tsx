import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// Components
import ConfirmModal from '@extension/components/ConfirmModal';
import EnableModal from '@extension/components/EnableModal';
import ErrorModal from '@extension/components/ErrorModal';
import MainLayout from '@extension/components/MainLayout';
import SignBytesModal from '@extension/components/SignBytesModal';

// Features
import {
  fetchAccountsThunk,
  startPollingForAccountInformationThunk,
} from '@extension/features/accounts';
import {
  setConfirm,
  setError,
  setNavigate,
  setToast,
} from '@extension/features/application';
import {
  fetchAssetsThunk,
  updateAssetInformationThunk,
} from '@extension/features/assets';
import {
  setEnableRequest,
  setSignBytesRequest,
} from '@extension/features/messages';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';

// Hooks
import useOnMessage from '@extension/hooks/useOnMessage';
import useOnNetworkConnectivity from '@extension/hooks/useOnNetworkConnectivity';

// Selectors
import {
  useSelectAccounts,
  useSelectAssets,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IAsset,
  IAssetHolding,
  INetwork,
} from '@extension/types';

// Utils
import { convertGenesisHashToHex } from '@extension/utils';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const accounts: IAccount[] = useSelectAccounts();
  const assets: Record<string, IAsset[]> | null = useSelectAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
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

  const handleConfirmClose = () => dispatch(setConfirm(null));
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));
  const handleErrorModalClose = () => dispatch(setError(null));
  const handleSignDataModalClose = () => dispatch(setSignBytesRequest(null));

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
    dispatch(fetchAssetsThunk());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (assets && selectedNetwork) {
      dispatch(
        fetchAccountsThunk({
          updateAccountInformation: true,
        })
      );
      dispatch(startPollingForAccountInformationThunk());
    }
  }, [assets, selectedNetwork]);
  useEffect(() => {
    if (accounts.length > 0 && assets) {
      accounts.forEach((account) => {
        const newAssets: IAssetHolding[] = account.assets.filter(
          (assetHolding) =>
            !assets[convertGenesisHashToHex(account.genesisHash)].some(
              (value) => value.id === assetHolding.id
            )
        );

        // if we have any new assets, update the information
        if (newAssets.length > 0) {
          dispatch(
            updateAssetInformationThunk({
              genesisHash: account.genesisHash,
              ids: newAssets.map((value) => value.id),
            })
          );
        }
      });
    }
  }, [accounts]);
  useOnNetworkConnectivity(); // listen to network connectivity
  useOnMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ConfirmModal onClose={handleConfirmClose} />
      <EnableModal onClose={handleEnableModalClose} />
      <SignBytesModal onClose={handleSignDataModalClose} />
      <ToastContainer />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
