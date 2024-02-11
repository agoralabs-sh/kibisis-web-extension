import { useSelector } from 'react-redux';

// types
import { IARC0200Asset, IMainRootState, INetwork } from '@extension/types';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Selects all the ARC200 assets for the selected network.
 * @returns {IArc200Asset[]} all network ARC200 assets for the selected network.
 */
export default function useSelectARC0200AssetsBySelectedNetwork(): IARC0200Asset[] {
  return useSelector<IMainRootState, IARC0200Asset[]>((state) => {
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
