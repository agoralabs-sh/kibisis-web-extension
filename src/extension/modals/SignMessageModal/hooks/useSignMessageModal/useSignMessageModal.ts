import {
  ARC0027MethodEnum,
  ISignMessageParams,
} from '@agoralabs-sh/avm-web-provider';
import { useEffect, useState } from 'react';

// enums
import { EventTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectEvents,
  useSelectNonWatchAccounts,
  useSelectSessions,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IClientRequestEvent,
} from '@extension/types';
import type { IUseSignMessageModalState } from './types';

// utils
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';

export default function useSignMessageModal(): IUseSignMessageModalState {
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const events = useSelectEvents();
  const sessions = useSelectSessions();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<
    IAccountWithExtendedProps[] | null
  >(null);
  const [event, setEvent] =
    useState<IClientRequestEvent<ISignMessageParams> | null>(null);
  const [signer, setSigner] = useState<IAccountWithExtendedProps | null>(null);

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.ClientRequest &&
          value.payload.message.method === ARC0027MethodEnum.SignMessage
      ) as IClientRequestEvent<ISignMessageParams>) || null
    );
  }, [events]);
  // when we have accounts, sessions and the event, update the authorized accounts
  useEffect(() => {
    let authorizedAddresses: string[];

    if (event && !authorizedAccounts) {
      authorizedAddresses = getAuthorizedAddressesForHost(
        event.payload.message.clientInfo.host,
        sessions
      );

      setAuthorizedAccounts(
        accounts.filter((account) =>
          authorizedAddresses.some(
            (value) =>
              value ===
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )
          )
        )
      );
    }
  }, [accounts, event, sessions]);
  // if we have the event and the authorized accounts update the signer
  useEffect(() => {
    if (event && authorizedAccounts && !signer) {
      setSigner(
        authorizedAccounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === event.payload.message.params?.signer
        ) ||
          authorizedAccounts[0] ||
          null
      );
    }
  }, [authorizedAccounts, event]);

  return {
    authorizedAccounts,
    event,
    signer,
    setAuthorizedAccounts,
    setSigner,
  };
}
