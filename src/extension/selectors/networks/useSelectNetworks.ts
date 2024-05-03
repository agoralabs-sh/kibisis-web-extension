import { useSelector } from 'react-redux';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

/**
 * Fetches all the available networks. Availability is subject to the settings.
 * @returns {INetworkWithTransactionParams[]} the available networks.
 */
export default function useSelectNetworks(): INetworkWithTransactionParams[] {
  return useSelector<IMainRootState, INetworkWithTransactionParams[]>(
    ({ networks, settings }) =>
      networks.items.filter((value) => {
        switch (value.type) {
          case NetworkTypeEnum.Beta:
            return settings.advanced.allowBetaNet;
          case NetworkTypeEnum.Stable:
            return settings.advanced.allowMainNet;
          case NetworkTypeEnum.Test:
          default:
            return true;
        }
      })
  );
}
