import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import ConnectModal from '../ConnectModal';
import ErrorModal from '../ErrorModal';
import SignDataModal from '../SignDataModal';

// Features
import { fetchAccounts, setSignDataRequest } from '../../features/accounts';
import { setError, setNavigate, setToast } from '../../features/application';
import { fetchSessions, setConnectRequest } from '../../features/sessions';
import { fetchSettings } from '../../features/settings';

// Hooks
import useOnMessage from '../../hooks/useOnMessage';

// Selectors
import { useSelectSelectedNetwork } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch, INetwork } from '../../types';

const MainAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const { toast, ToastContainer } = createStandaloneToast({ theme });
  const handleConnectModalClose = () => {
    dispatch(setConnectRequest(null));
  };
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };
  const handleSignDataModalClose = () => {
    dispatch(setSignDataRequest(null));
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchSettings());
    dispatch(fetchSessions());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (selectedNetwork) {
      dispatch(fetchAccounts());
    }
  }, [selectedNetwork]);
  useOnMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ConnectModal onClose={handleConnectModalClose} />
      <SignDataModal onClose={handleSignDataModalClose} />
      <ToastContainer />
      {children}
    </>
  );
};

export default MainAppProvider;
