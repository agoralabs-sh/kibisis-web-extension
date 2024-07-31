import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { fetchAccountsFromStorageThunk } from '@extension/features/accounts';
import { handleNewEventByIdThunk } from '@extension/features/events';
import { closeCurrentWindowThunk } from '@extension/features/layout';
import { fetchFromStorageThunk as fetchPasskeyCredentialFromStorageThunk } from '@extension/features/passkeys';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettingsFromStorageThunk } from '@extension/features/settings';
import { fetchStandardAssetsFromStorageThunk } from '@extension/features/standard-assets';
import { fetchFromStorageThunk as fetchSystemInfoFromStorageThunk } from '@extension/features/system';

// hooks
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';

// modals
import ARC0300KeyRegistrationTransactionSendEventModal from '@extension/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import EnableModal from '@extension/modals/EnableModal';
import SignMessageModal from '@extension/modals/SignMessageModal';
import SignTransactionsModal from '@extension/modals/SignTransactionsModal';

// pages
import SplashPage from '@extension/pages/SplashPage';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch } from '@extension/types';

// utils
import decodeURLSearchParam from '@extension/utils/decodeURLSearchParam';

const Root: FC = () => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const network = useSelectSelectedNetwork();
  const settings = useSelectSettings();
  // misc
  const url = new URL(window.location.href);
  const eventId = decodeURLSearchParam('eventId', url.searchParams);
  // handlers
  const handleModalClose = () => dispatch(closeCurrentWindowThunk());

  useEffect(() => {
    // if we don't have the necessary information, close this window
    if (!eventId) {
      dispatch(closeCurrentWindowThunk());

      return;
    }

    dispatch(fetchPasskeyCredentialFromStorageThunk());
    dispatch(fetchSystemInfoFromStorageThunk());
    dispatch(fetchSettingsFromStorageThunk());
    dispatch(fetchSessionsThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (network) {
      dispatch(fetchAccountsFromStorageThunk());
    }
  }, [network]);
  useEffect(() => {
    if (eventId) {
      dispatch(handleNewEventByIdThunk(eventId));
    }
  }, [eventId]);
  useOnDebugLogging();

  return (
    <>
      <EnableModal onClose={handleModalClose} />
      <SignMessageModal onClose={handleModalClose} />
      <SignTransactionsModal onClose={handleModalClose} />
      <ARC0300KeyRegistrationTransactionSendEventModal
        onClose={handleModalClose}
      />

      <SplashPage />
    </>
  );
};

export default Root;
