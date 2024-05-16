// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import type { INetwork, ISettings } from '@extension/types';

/**
 * Gets the supported networks based on the settings.
 * @param {T extends INetwork} networks - a list of networks to filter.
 * @param {ISettings} settings - the settings.
 * @returns {T extends INetwork} a filtered list of supported networks based on the settings.
 */
export default function supportedNetworksFromSettings<T extends INetwork>(
  networks: T[],
  settings: ISettings
): T[] {
  return networks.filter((value) => {
    switch (value.type) {
      case NetworkTypeEnum.Beta:
        return settings.advanced.allowBetaNet;
      case NetworkTypeEnum.Stable:
        return settings.advanced.allowMainNet;
      case NetworkTypeEnum.Test:
      default:
        return true;
    }
  });
}
