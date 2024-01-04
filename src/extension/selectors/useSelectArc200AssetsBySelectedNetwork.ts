import { useSelector } from 'react-redux';

// types
import { IArc200Asset, IMainRootState, INetwork } from '@extension/types';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Selects all the ARC200 assets for the selected network.
 * @returns {IArc200Asset[]} all network ARC200 assets for the selected network.
 */
export default function useSelectArc200AssetsBySelectedNetwork(): IArc200Asset[] {
  return useSelector<IMainRootState, IArc200Asset[]>((state) => {
    const selectedNetwork: INetwork | null = selectNetworkFromSettings(
      state.networks.items,
      state.settings
    );

    if (!selectedNetwork) {
      return [];
    }

    return state.arc200Assets.items
      ? state.arc200Assets.items[
          convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
        ]
      : [];
  });
}
