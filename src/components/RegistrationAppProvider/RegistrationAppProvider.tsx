import { createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import ErrorModal from '../ErrorModal';

// Errors
import { BaseError } from '../../errors';

// Features
import { setError, setNavigate, setToast } from '../../features/application';

// Selectors
import { useSelectError } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch } from '../../types';

const RegistrationAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { toast, ToastContainer } = createStandaloneToast({ theme });
  const error: BaseError | null = useSelectError();
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
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
