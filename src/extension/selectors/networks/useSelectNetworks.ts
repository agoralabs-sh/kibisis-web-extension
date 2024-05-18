import { useSelector } from 'react-redux';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';

/**
 * Fetches all the available networks. Availability is subject to the settings.
 * @returns {INetworkWithTransactionParams[]} the available networks.
 */
export default function useSelectNetworks(): INetworkWithTransactionParams[] {
  return useSelector<IMainRootState, INetworkWithTransactionParams[]>(
    ({ networks, settings }) =>
      supportedNetworksFromSettings(networks.items, settings)
  );
}
