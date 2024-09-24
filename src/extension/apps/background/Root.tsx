import React, { type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { handleNewEventByIdThunk } from '@extension/features/events';
import { closeCurrentWindowThunk } from '@extension/features/layout';
import { setI18nAction } from '@extension/features/system';

// hooks
import useOnAppStartup from '@extension/hooks/useOnAppStartup';
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';

// modals
import ARC0300KeyRegistrationTransactionSendEventModal from '@extension/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import EnableModal from '@extension/modals/EnableModal';
import SignMessageModal from '@extension/modals/SignMessageModal';
import SignTransactionsModal from '@extension/modals/SignTransactionsModal';

// pages
import SplashPage from '@extension/pages/SplashPage';

// types
import type {
  IAppThunkDispatch,
  IBackgroundRootState,
  IRootProps,
} from '@extension/types';

// utils
import decodeURLSearchParam from '@extension/utils/decodeURLSearchParam';

const Root: FC<IRootProps> = ({ i18n }) => {
  const dispatch = useDispatch<IAppThunkDispatch<IBackgroundRootState>>();
  // misc
  const url = new URL(window.location.href);
  const eventId = decodeURLSearchParam('eventId', url.searchParams);
  // handlers
  const handleModalClose = () => dispatch(closeCurrentWindowThunk());

  useOnAppStartup();
  useEffect(() => {
    // if we don't have the necessary information, close this window
    if (!eventId) {
      dispatch(closeCurrentWindowThunk());

      return;
    }

    dispatch(setI18nAction(i18n));
  }, []);
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
