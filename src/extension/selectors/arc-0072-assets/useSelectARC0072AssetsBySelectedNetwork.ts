import { useSelector } from 'react-redux';

// types
import type { IARC0072Asset, IMainRootState } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

/**
 * Selects all the ARC-0072 assets for the selected network.
 * @returns {IARC0072Asset[]} all network ARC-0072 assets for the selected network.
 */
export default function useSelectARC0072AssetsBySelectedNetwork(): IARC0072Asset[] {
  return useSelector<IMainRootState, IARC0072Asset[]>((state) => {
    const network = selectNetworkFromSettings({
      networks: state.networks.items,
      settings: state.settings,
    });

    if (!network) {
      return [];
    }

    return state.arc0072Assets.items
      ? state.arc0072Assets.items[convertGenesisHashToHex(network.genesisHash)]
      : [];
  });
}
