import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import ConnectModal from '../ConnectModal';
import ErrorModal from '../ErrorModal';

// Features
import { fetchAccounts } from '../../features/accounts';
import { setError, setNavigate, setToast } from '../../features/application';
import { fetchSessions, setConnectRequest } from '../../features/sessions';

// Hooks
import useOnMessage from '../../hooks/useOnMessage';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch } from '../../types';

const MainAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { toast, ToastContainer } = createStandaloneToast({ theme });
  const handleConnectModalClose = () => {
    dispatch(setConnectRequest(null));
  };
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchAccounts());
    dispatch(fetchSessions());
  }, []);
  useOnMessage(); // handle incoming messages

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ConnectModal onClose={handleConnectModalClose} />
      <ToastContainer />
      {children}
    </>
  );
};

export default MainAppProvider;
