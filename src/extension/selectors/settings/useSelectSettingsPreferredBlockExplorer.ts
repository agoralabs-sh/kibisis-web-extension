import { useSelector } from 'react-redux';

// types
import type {
  IBlockExplorer,
  IMainRootState,
  INetwork,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Gets the currently preferred block explorer from the settings. If the block explorer cannot be found, the default
 * explorer is used (first index), or null.
 * @returns {IBlockExplorer | null} the current preferred block explorer from settings, or the default explorer, or null.
 */
export default function useSelectPreferredBlockExplorer(): IBlockExplorer | null {
  return useSelector<IMainRootState, IBlockExplorer | null>((state) => {
    const selectedNetwork: INetwork | null =
      state.networks.items.find(
        (value) =>
          value.genesisHash ===
          state.settings.general.selectedNetworkGenesisHash
      ) || null;

    if (!selectedNetwork) {
      return null;
    }

    return (
      selectedNetwork.blockExplorers.find(
        (value) =>
          value.id ===
          state.settings.general.preferredBlockExplorerIds[
            convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
          ]
      ) ||
      selectedNetwork.blockExplorers[0] ||
      null
    );
  });
}
