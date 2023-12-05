import { useSelector } from 'react-redux';

// types
import { IExplorer, IMainRootState, INetwork } from '@extension/types';
import { convertGenesisHashToHex } from '@extension/utils';

/**
 * Gets the currently preferred block explorer from the settings.
 * @returns {IExplorer | null} the current preferred block explorer from settings.
 */
export default function useSelectPreferredBlockExplorer(): IExplorer | null {
  return useSelector<IMainRootState, IExplorer | null>((state) => {
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
      selectedNetwork.explorers.find(
        (value) =>
          value.id ===
          state.settings.general.preferredBlockExplorerIds[
            convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
          ]
      ) ||
      selectedNetwork.explorers[0] ||
      null
    );
  });
}
