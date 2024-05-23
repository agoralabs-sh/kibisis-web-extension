import {
  ARC0027MethodEnum,
  IEnableParams,
} from '@agoralabs-sh/avm-web-provider';
import { useEffect, useState } from 'react';

// enums
import { EventTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectAccounts,
  useSelectEvents,
  useSelectNetworks,
} from '@extension/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IClientRequestEvent,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { IUseEnableModalState } from './types';

// utils
import availableAccountsForNetwork from '@extension/utils/availableAccountsForNetwork';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

export default function useEnableModal(): IUseEnableModalState {
  // selectors
  const accounts = useSelectAccounts();
  const events = useSelectEvents();
  const networks = useSelectNetworks();
  // state
  const [availableAccounts, setAvailableAccounts] = useState<
    IAccountWithExtendedProps[] | null
  >(null);
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
  // get the available accounts
  useEffect(() => {
    if (event && network) {
      setAvailableAccounts(
        availableAccountsForNetwork({
          accounts,
          network,
        })
      );
    }
  }, [accounts, network, event]);
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
    availableAccounts,
    event,
    network,
    setAvailableAccounts,
    setNetwork,
  };
}
