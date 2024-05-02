import { useSelector } from 'react-redux';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Gets a network by the genesis hash or fallbacks back to the selected/default network.
 * @param {string} genesisHash - the genesis hash of the network to select.
 * @returns {INetworkWithTransactionParams} the network by genesis hash, the selected network or the default network.
 */
export default function useSelectNetworkByGenesisHashWithFallback(
  genesisHash: string
): INetworkWithTransactionParams {
  return useSelector<IMainRootState, INetworkWithTransactionParams>(
    ({ networks, settings }) => {
      return (
        networks.items.find((value) => value.genesisHash === genesisHash) ||
        selectNetworkFromSettings(networks.items, settings) ||
        selectDefaultNetwork(networks.items)
      );
    }
  );
}
