import { useSelector } from 'react-redux';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

/**
 * Gets the currently selected network from the settings.
 * @returns {INetworkWithTransactionParams | null} the current selected network.
 */
export default function useSelectSelectedNetwork(): INetworkWithTransactionParams | null {
  return useSelector<IMainRootState, INetworkWithTransactionParams | null>(
    (state) => {
      return (
        state.networks.items.find(
          (value) =>
            value.genesisHash ===
            state.settings.general.selectedNetworkGenesisHash
        ) || null
      );
    }
  );
}
