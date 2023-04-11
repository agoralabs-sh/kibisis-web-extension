import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import EnableModal from '@extension/components/EnableModal';
import ErrorModal from '@extension/components/ErrorModal';
import SignBytesModal from '@extension/components/SignBytesModal';

// Features
import {
  fetchAccountsThunk,
  startPollingForAccountInformationThunk,
} from '@extension/features/accounts';
import {
  setError,
  setNavigate,
  setToast,
} from '@extension/features/application';
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
import { useSelectSelectedNetwork } from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAppThunkDispatch, INetwork } from '@extension/types';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const { toast, ToastContainer } = createStandaloneToast({ theme });

  const handleEnableModalClose = () => dispatch(setEnableRequest(null));
  const handleErrorModalClose = () => dispatch(setError(null));
  const handleSignDataModalClose = () => dispatch(setSignBytesRequest(null));

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (selectedNetwork) {
      dispatch(
        fetchAccountsThunk({
          updateAccountInformation: true,
        })
      );
      dispatch(startPollingForAccountInformationThunk());
    }
  }, [selectedNetwork]);
  useOnNetworkConnectivity(); // listen to network connectivity
  useOnMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <EnableModal onClose={handleEnableModalClose} />
      <SignBytesModal onClose={handleSignDataModalClose} />
      <ToastContainer />
      {children}
    </>
  );
};

export default AppProvider;
