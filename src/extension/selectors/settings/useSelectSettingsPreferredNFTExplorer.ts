import { useSelector } from 'react-redux';

// types
import type { IMainRootState, INetwork, INFTExplorer } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Gets the currently preferred NFT explorer from the settings. If the NFT explorer cannot be found, the default
 * explorer is used (first index), or null.
 * @returns {INFTExplorer | null} the current preferred NFT explorer from settings, or the default explorer, or null.
 */
export default function useSelectPreferredNFTExplorer(): INFTExplorer | null {
  return useSelector<IMainRootState, INFTExplorer | null>((state) => {
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
      selectedNetwork.nftExplorers.find(
        (value) =>
          value.id ===
          state.settings.general.preferredNFTExplorerIds[
            convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
          ]
      ) ||
      selectedNetwork.nftExplorers[0] ||
      null
    );
  });
}
