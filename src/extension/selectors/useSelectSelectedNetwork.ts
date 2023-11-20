import { useSelector } from 'react-redux';

// types
import { IMainRootState, INetwork } from '@extension/types';

/**
 * Gets the currently selected network from the settings.
 * @returns {INetwork | null} the current selected network.
 */
export default function useSelectSelectedNetwork(): INetwork | null {
  return useSelector<IMainRootState, INetwork | null>((state) => {
    return (
      state.networks.items.find(
        (value) =>
          value.genesisHash ===
          state.settings.general.selectedNetworkGenesisHash
      ) || null
    );
  });
}
