import { useSelector } from 'react-redux';

// types
import type {
  IStandardAsset,
  IMainRootState,
  INetwork,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

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
