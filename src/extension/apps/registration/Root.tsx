import { Center, Flex } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// features
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc200-assets';
import { fetchSettingsFromStorageThunk } from '@extension/features/settings';

// types
import type {
  IAppThunkDispatch,
  IRegistrationRootState,
} from '@extension/types';

const Root: FC = () => {
  const dispatch: IAppThunkDispatch<IRegistrationRootState> =
    useDispatch<IAppThunkDispatch<IRegistrationRootState>>();

  useEffect(() => {
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
