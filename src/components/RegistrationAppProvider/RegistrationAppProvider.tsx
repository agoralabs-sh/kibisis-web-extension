import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

// Components
import ErrorModal from '../ErrorModal';

// Errors
import { BaseError } from '../../errors';

// Features
import { setError, setNavigate, setToast } from '../../features/application';

// Selectors
import { useSelectError, useSelectLogger } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch, IInternalEvents, ILogger } from '../../types';

const RegistrationAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { toast, ToastContainer } = createStandaloneToast({ theme });
  const logger: ILogger = useSelectLogger();
  const error: BaseError | null = useSelectError();
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };
  const handleOnMessage = (message: IInternalEvents) => {
    logger.debug(`RegistrationAppProvider#onConnect(): ${message.event}`);
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));

    // handle messages
    browser.runtime.onMessage.addListener(handleOnMessage);

    return function cleanup() {
      browser.runtime.onMessage.removeListener(handleOnMessage);
    };
  }, []);

  return (
    <>
      <ErrorModal error={error} onClose={handleErrorModalClose} />
      <ToastContainer />
      {children}
    </>
  );
};

export default RegistrationAppProvider;
