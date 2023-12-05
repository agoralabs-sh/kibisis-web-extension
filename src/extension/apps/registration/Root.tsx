import { Center, Flex } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// components
import ErrorModal from '@extension/components/ErrorModal';

// features
import { setError, setNavigate } from '@extension/features/system';
import { fetchSettings } from '@extension/features/settings';

// types
import { IAppThunkDispatch } from '@extension/types';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const handleErrorModalClose = () => {
    dispatch(setError(null));
  };

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(fetchSettings());
  }, []);

  return (
    <>
      <ErrorModal onClose={handleErrorModalClose} />
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
