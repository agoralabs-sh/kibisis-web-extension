// types
import type { INetwork } from '@extension/types';
import type { IOptions } from './types';

// utils
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

/**
 * Convenience function that simply gets the selected network from the settings.
 * @param {IOptions} options - a list of networks, the settings and the option to fallback to the default network.
 * @returns {<T extends INetwork> | null} the selected network in settings, or null if no network has been selected or
 * the selected network does not exit in the networks list.
 */
export default function selectNetworkFromSettings<T extends INetwork>({
  networks,
  settings,
  withDefaultFallback = false,
}: IOptions<T>): T | null {
  let network =
    networks.find(
      (value) =>
        value.genesisHash === settings.general.selectedNetworkGenesisHash
    ) || null;

  if (withDefaultFallback && !network) {
    network = selectDefaultNetwork(networks);
  }

  return network;
}
