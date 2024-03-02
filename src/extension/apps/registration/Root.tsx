import { Center, Flex } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// features
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc200-assets';
import { fetchSettingsFromStorageThunk } from '@extension/features/settings';
import { setNavigate } from '@extension/features/system';

// types
import type {
  IAppThunkDispatch,
  IRegistrationRootState,
} from '@extension/types';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch<IRegistrationRootState> =
    useDispatch<IAppThunkDispatch<IRegistrationRootState>>();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    dispatch(setNavigate(navigate));
    dispatch(fetchARC0200AssetsFromStorageThunk());
    dispatch(fetchSettingsFromStorageThunk());
  }, []);

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
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
  );
};

export default Root;
