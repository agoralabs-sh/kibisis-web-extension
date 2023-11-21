import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// components
import EnableModal from '@extension/components/EnableModal';
import LoadingPage from '@extension/components/LoadingPage';
import SignTxnsModal from '@extension/components/SignTxnsModal';
import SignBytesModal from '@extension/components/SignBytesModal';

// enums
import { EventNameEnum } from '@common/enums';

// features
import { fetchAccountsFromStorageThunk } from '@extension/features/accounts';
import {
  closeCurrentWindowThunk,
  sendBackgroundAppLoadThunk,
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/messages';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';

// hooks
import useOnBackgroundAppMessage from '@extension/hooks/useOnBackgroundAppMessage';

// selectors
import { useSelectSelectedNetwork } from '@extension/selectors';

// types
import { IAppThunkDispatch, INetwork } from '@extension/types';

// utils
import { decodeURLSearchParam } from '@extension/utils';

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
  const filteredEvent: string | null = decodeURLSearchParam(
    'eventType',
    url.searchParams
  );
  const originTabId: string | null = decodeURLSearchParam(
    'originTabId',
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
  };

  useEffect(() => {
    // if we don't have the necessary information, close this window
    if (!eventId || !originTabId) {
      dispatch(closeCurrentWindowThunk());

      return;
    }

    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
    dispatch(sendBackgroundAppLoadThunk(eventId));
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (selectedNetwork) {
      dispatch(fetchAccountsFromStorageThunk());
    }
  }, [selectedNetwork]);
  useOnBackgroundAppMessage(
    filteredEvent ? [filteredEvent as EventNameEnum] : [],
    originTabId ? parseInt(originTabId) : null
  ); // handle incoming messages by the filtered event

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
