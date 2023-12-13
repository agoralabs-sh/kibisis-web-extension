import { useSelector } from 'react-redux';

// types
import { IAsset, IMainRootState, INetwork } from '@extension/types';
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';

/**
 * Selects all the standard assets for the selected network.
 * @returns {IAsset[]} all network assets, or null.
 */
export default function useSelectStandardAssetsBySelectedNetwork(): IAsset[] {
  return useSelector<IMainRootState, IAsset[]>((state) => {
    const selectedNetwork: INetwork | null = selectNetworkFromSettings(
      state.networks.items,
      state.settings
    );

    if (!selectedNetwork) {
      return [];
    }

    return state.standardAssets.items
      ? state.standardAssets.items[
          convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
        ]
      : [];
  });
}
