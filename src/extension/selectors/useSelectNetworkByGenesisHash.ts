import { useSelector } from 'react-redux';

// types
import { IMainRootState, INetwork } from '@extension/types';

/**
 * Gets a network by the genesis hash or null.
 * @returns {INetwork | null} the network or null if the network does not exist.
 */
export default function useSelectNetworkByGenesisHash(
  genesisHash: string
): INetwork | null {
  return useSelector<IMainRootState, INetwork | null>(
    (state) =>
      state.networks.items.find((value) => value.genesisHash === genesisHash) ||
      null
  );
}
