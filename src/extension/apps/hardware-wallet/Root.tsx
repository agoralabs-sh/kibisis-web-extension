import { useDisclosure } from '@chakra-ui/react';
import React, { type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// enums
import { AppTypeEnum } from './enums';

// features
import { fetchActiveThunk as fetchCredentialLockActiveThunk } from '@extension/features/credential-lock';
import { closeCurrentWindowThunk } from '@extension/features/layout';
import { fetchFromStorageThunk as fetchPasskeyCredentialFromStorageThunk } from '@extension/features/passkeys';
import { setI18nAction } from '@extension/features/system';

// hooks
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';

// modals
import AddLedgerAccountModal from '@extension/modals/AddLedgerAccountModal';

// pages
import SplashPage from '@extension/pages/SplashPage';

// types
import type {
  IAppThunkDispatch,
  IHardwareWalletRootState,
  IRootProps,
} from '@extension/types';

// utils
import decodeURLSearchParam from '@extension/utils/decodeURLSearchParam';

const Root: FC<IRootProps> = ({ i18n }) => {
  const dispatch = useDispatch<IAppThunkDispatch<IHardwareWalletRootState>>();
  const { isOpen: isAddLedgerAccountOpen, onOpen: onAddLedgerAccountOpen } =
    useDisclosure();
  // misc
  const url = new URL(window.location.href);
  const type = decodeURLSearchParam('type', url.searchParams);
  // handlers
  const handleClose = () => dispatch(closeCurrentWindowThunk());
  const handleOnAddAccountComplete = () => {};

  useEffect(() => {
    // if we don't have the necessary information, close the tab window
    if (!type) {
      handleClose();

      return;
    }

    // fetch required data
    dispatch(fetchCredentialLockActiveThunk());
    dispatch(fetchPasskeyCredentialFromStorageThunk());
    dispatch(setI18nAction(i18n));
  }, []);
  useEffect(() => {
    if (type) {
      switch (type) {
        case AppTypeEnum.Add:
          onAddLedgerAccountOpen();
          return;
        default:
          handleClose();
          return;
      }
    }
  }, [type]);
  useOnDebugLogging();

  return (
    <>
      <AddLedgerAccountModal
        isOpen={isAddLedgerAccountOpen}
        onClose={handleClose}
        onComplete={handleOnAddAccountComplete}
      />

      <SplashPage />
    </>
  );
};

export default Root;
