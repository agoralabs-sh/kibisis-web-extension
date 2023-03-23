import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import ConnectModal from '../ConnectModal';
import ErrorModal from '../ErrorModal';

// Errors
import { BaseError } from '../../errors';

// Features
import { fetchAccounts } from '../../features/accounts';
import { setError, setNavigate, setToast } from '../../features/application';
import {
  fetchSessions,
  IConnectRequest,
  setConnectRequest,
} from '../../features/sessions';

// Hooks
import useOnMessage from '../../hooks/useOnMessage';

// Selectors
import { useSelectConnectRequest, useSelectError } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch } from '../../types';

const MainAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { toast, ToastContainer } = createStandaloneToast({ theme });
  const connectRequest: IConnectRequest | null = useSelectConnectRequest();
  const error: BaseError | null = useSelectError();
  const handleConnectModalClose = () => {
    // TODO: send operation canceled error
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
      <ErrorModal error={error} onClose={handleErrorModalClose} />
      <ConnectModal
        connectRequest={connectRequest}
        onClose={handleConnectModalClose}
      />
      <ToastContainer />
      {children}
    </>
  );
};

export default MainAppProvider;
