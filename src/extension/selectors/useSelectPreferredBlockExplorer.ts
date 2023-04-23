import { useSelector } from 'react-redux';

// Types
import { IExplorer, IMainRootState, INetwork } from '@extension/types';

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
        (value) => value.id === state.settings.general.preferredBlockExplorerId
      ) || null
    );
  });
}
