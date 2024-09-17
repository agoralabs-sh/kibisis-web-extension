// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import type { INetwork } from '@extension/types';
import type { IOptions } from './types';

/**
 * Gets the supported networks based on the settings.
 * @param {IOptions} options - a list of networks to filter and the settings
 * @returns {T extends INetwork} a filtered list of supported networks based on the settings.
 */
export default function supportedNetworksFromSettings<T extends INetwork>({
  networks,
  settings,
}: IOptions<T>): T[] {
  return networks.filter((value) => {
    switch (value.type) {
      case NetworkTypeEnum.Beta:
        return settings.advanced.allowBetaNet;
      case NetworkTypeEnum.Test:
        return settings.advanced.allowTestNet;
      case NetworkTypeEnum.Stable:
      default:
        return true;
    }
  });
}
