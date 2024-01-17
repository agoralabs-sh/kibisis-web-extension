// services
import SettingsService from '@extension/services/SettingsService';

// types
import type { INetwork } from '@extension/types';

// utils
import fetchSupportedNetworks from '../fetchSupportedNetworks';

/**
 * Checks whether a genesis hash is supported in the network configs. This also checks the settings to filter networks
 * by enabled/disabled networks.
 * @param {string} genesisHash - the genesis hash of network to check.
 * @param {SettingsService} settingsService - an initialized setting service.
 * @returns {Promise<boolean>} true if the network is supported, false otherwise.
 */
export default async function isNetworkSupported(
  genesisHash: string,
  settingsService: SettingsService
): Promise<boolean> {
  const supportedNetworks: INetwork[] = await fetchSupportedNetworks(
    settingsService
  );

  // determine if network genesis hash is in the filtered networks
  return supportedNetworks.some((value) => value.genesisHash === genesisHash);
}
