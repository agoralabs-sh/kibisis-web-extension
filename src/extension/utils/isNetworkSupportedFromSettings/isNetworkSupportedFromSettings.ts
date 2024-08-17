// types
import type { IOptions } from './types';

// utils
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';

/**
 * Convenience function that simply checks whether a genesis hash is supported in the settings.
 * @param {IOptions} options - the genesis hash of network to check, a list of networks and the settings.
 * @returns {boolean} true if the network is supported, false otherwise.
 */
export default function isNetworkSupportedFromSettings({
  genesisHash,
  networks,
  settings,
}: IOptions): boolean {
  return supportedNetworksFromSettings({
    networks,
    settings,
  }).some((value) => value.genesisHash === genesisHash);
}
