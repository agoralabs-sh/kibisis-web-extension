import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState, INetwork } from '@extension/types';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Selects all the standard assets for the selected network.
 * @returns {IStandardAsset[]} all standard assets for the selected network.
 */
export default function useSelectStandardAssetsBySelectedNetwork(): IStandardAsset[] {
  return useSelector<IMainRootState, IStandardAsset[]>((state) => {
    const network: INetwork | null = selectNetworkFromSettings({
      networks: state.networks.items,
      settings: state.settings,
    });

    if (!network) {
      return [];
    }

    return state.standardAssets.items
      ? state.standardAssets.items[convertGenesisHashToHex(network.genesisHash)]
      : [];
  });
}
