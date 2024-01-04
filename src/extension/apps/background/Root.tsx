import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// components
import LoadingPage from '@extension/components/LoadingPage';

// features
import { fetchAccountsFromStorageThunk } from '@extension/features/accounts';
import {
  handleNewEventByIdThunk,
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/events';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettingsFromStorage } from '@extension/features/settings';
import { closeCurrentWindowThunk } from '@extension/features/system';

// hooks
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';

// modals
import EnableModal from '@extension/modals/EnableModal';
import SignTxnsModal from '@extension/modals/SignTxnsModal';
import SignBytesModal from '@extension/modals/SignBytesModal';

// selectors
import { useSelectSelectedNetwork } from '@extension/selectors';

// types
import { IAppThunkDispatch, INetwork } from '@extension/types';

// utils
import decodeURLSearchParam from '@extension/utils/decodeURLSearchParam';

enum ModalTypeEnum {
  Enable,
  SignBytes,
  SignTransactions,
}

const Root: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const url: URL = new URL(window.location.href);
  const eventId: string | null = decodeURLSearchParam(
    'eventId',
    url.searchParams
  );
  const handleModalClose = (type: ModalTypeEnum) => () => {
    switch (type) {
      case ModalTypeEnum.Enable:
        dispatch(setEnableRequest(null));

        break;
      case ModalTypeEnum.SignBytes:
        dispatch(setSignBytesRequest(null));

        break;
      case ModalTypeEnum.SignTransactions:
        dispatch(setSignTxnsRequest(null));

        break;
      default:
        break;
    }

    // when the request has finished, close the window
    dispatch(closeCurrentWindowThunk());
  };

  useEffect(() => {
    // if we don't have the necessary information, close this window
    if (!eventId) {
      dispatch(closeCurrentWindowThunk());

      return;
    }

    dispatch(fetchSettingsFromStorage());
    dispatch(fetchSessionsThunk());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (selectedNetwork) {
      dispatch(fetchAccountsFromStorageThunk());
    }
  }, [selectedNetwork]);
  useEffect(() => {
    if (eventId) {
      dispatch(handleNewEventByIdThunk(eventId));
    }
  }, [eventId]);
  useOnDebugLogging();

  return (
    <>
      <EnableModal onClose={handleModalClose(ModalTypeEnum.Enable)} />
      <SignBytesModal onClose={handleModalClose(ModalTypeEnum.SignBytes)} />
      <SignTxnsModal
        onClose={handleModalClose(ModalTypeEnum.SignTransactions)}
      />
      <LoadingPage />
    </>
  );
};

export default Root;
