import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState, INetwork } from '@extension/types';
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';

/**
 * Selects all the standard assets for the selected network.
 * @returns {IStandardAsset[]} all standard assets for the selected network.
 */
export default function useSelectStandardAssetsBySelectedNetwork(): IStandardAsset[] {
  return useSelector<IMainRootState, IStandardAsset[]>((state) => {
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
