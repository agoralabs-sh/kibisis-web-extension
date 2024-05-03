import { useSelector } from 'react-redux';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

/**
 * Gets a network by the genesis hash or null.
 * @param {string} genesisHash - the genesis hash of the network to select.
 * @returns {INetworkWithTransactionParams | null} the network or null if the network does not exist.
 */
export default function useSelectNetworkByGenesisHash(
  genesisHash: string
): INetworkWithTransactionParams | null {
  return useSelector<IMainRootState, INetworkWithTransactionParams | null>(
    (state) =>
      state.networks.items.find((value) => value.genesisHash === genesisHash) ||
      null
  );
}
