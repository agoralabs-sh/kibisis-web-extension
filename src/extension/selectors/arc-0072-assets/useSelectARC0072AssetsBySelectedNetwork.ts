import { useSelector } from 'react-redux';

// types
import type { IARC0072Asset, IMainRootState, INetwork } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Selects all the ARC-0072 assets for the selected network.
 * @returns {IARC0072Asset[]} all network ARC-0072 assets for the selected network.
 */
export default function useSelectARC0072AssetsBySelectedNetwork(): IARC0072Asset[] {
  return useSelector<IMainRootState, IARC0072Asset[]>((state) => {
    const selectedNetwork: INetwork | null = selectNetworkFromSettings(
      state.networks.items,
      state.settings
    );

    if (!selectedNetwork) {
      return [];
    }

    return state.arc0072Assets.items
      ? state.arc0072Assets.items[
          convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
        ]
      : [];
  });
}
