import {
  ARC0027MethodEnum,
  IEnableParams,
} from '@agoralabs-sh/avm-web-provider';
import { useEffect, useState } from 'react';

// enums
import { EventTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectEvents,
  useSelectNetworks,
  useSelectNonWatchAccounts,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IClientRequestEvent,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { IUseEnableModalState } from './types';

import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

export default function useEnableModal(): IUseEnableModalState {
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const events = useSelectEvents();
  const networks = useSelectNetworks();
  // state
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  const [event, setEvent] = useState<IClientRequestEvent<IEnableParams> | null>(
    null
  );
  const [network, setNetwork] = useState<INetworkWithTransactionParams | null>(
    null
  );

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.ClientRequest &&
          value.payload.message.method === ARC0027MethodEnum.Enable
      ) as IClientRequestEvent<IEnableParams>) || null
    );
  }, [events]);
  // if the authorized addresses are empty, auto add the first address
  useEffect(() => {
    if (event && authorizedAddresses.length <= 0 && accounts.length > 0) {
      setAuthorizedAddresses([
        AccountService.convertPublicKeyToAlgorandAddress(accounts[0].publicKey),
      ]);
    }
  }, [accounts, event]);
  useEffect(() => {
    if (event && !network) {
      // find the selected network, or use the default one
      setNetwork(
        networks.find(
          (value) =>
            value.genesisHash === event.payload.message.params?.genesisHash
        ) || selectDefaultNetwork(networks)
      );
    }
  }, [event, networks]);

  return {
    authorizedAddresses,
    event,
    network,
    setAuthorizedAddresses,
    setNetwork,
  };
}
