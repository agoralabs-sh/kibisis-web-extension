// Enums
import { NetworkTypeEnum } from '../../../enums';

// Types
import { INetwork, ISettings } from '../../../types';

/**
 * Creates a default settings object.
 * @param {INetwork[]} networks - the list of networks available.
 * @returns {ISettings} the default settings.
 */
export default function createDefaultSettings(networks: INetwork[]): ISettings {
  return {
    network:
      networks.find((value) => value.type === NetworkTypeEnum.Stable) ||
      networks[0],
  };
}
