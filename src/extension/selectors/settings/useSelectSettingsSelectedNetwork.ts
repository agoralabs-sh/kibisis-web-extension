import { useSelector } from 'react-redux';

// types
import type {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

/**
 * Gets the currently selected network from the settings.
 * @returns {INetworkWithTransactionParams | null} the current selected network.
 */
export default function useSelectSettingsSelectedNetwork(): INetworkWithTransactionParams | null {
  return useSelector<IMainRootState, INetworkWithTransactionParams | null>(
    (state) =>
      state.networks.items.find(
        (value) =>
          value.genesisHash ===
          state.settings.general.selectedNetworkGenesisHash
      ) || null
  );
}
