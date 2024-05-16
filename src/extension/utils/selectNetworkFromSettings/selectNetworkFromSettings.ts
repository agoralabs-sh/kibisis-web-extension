// types
import { INetwork, ISettings } from '@extension/types';

/**
 * Convenience function that simply gets the selected network from the settings.
 * @param {<T extends INetwork>[]} networks - the list of networks.
 * @param {ISettings} settings - the settings.
 * @returns {<T extends INetwork> | null} the selected network in settings, or null if no network has been selected or the selected
 * network does not exit in the networks list.
 */
export default function selectNetworkFromSettings<T extends INetwork>(
  networks: T[],
  settings: ISettings
): T | null {
  return (
    networks.find(
      (value) =>
        value.genesisHash === settings.general.selectedNetworkGenesisHash
    ) || null
  );
}
