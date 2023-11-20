import { Center, createStandaloneToast, Flex } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// components
import ErrorModal from '@extension/components/ErrorModal';

// features
import { setError, setNavigate, setToast } from '@extension/features/system';
import { fetchSettings } from '@extension/features/settings';

// theme
import { theme } from '@extension/theme';

// types
import { IAppThunkDispatch } from '@extension/types';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
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
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(setToast(toast));
    dispatch(fetchSettings());
  }, []);

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
      <ToastContainer />
      <Center as="main" backgroundColor="var(--chakra-colors-chakra-body-bg)">
        <Flex
          alignItems="center"
          direction="column"
          justifyContent="center"
          minH="100vh"
          w="full"
        >
          <Outlet />
        </Flex>
      </Center>
    </>
  );
};

export default Root;
