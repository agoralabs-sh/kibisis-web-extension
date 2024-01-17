// config
import { networks } from '@extension/config';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import { INetwork, ISettings } from '@extension/types';

/**
 * Gets all the supported networks. Networks are further filtered by which networks are enabled/disabled in the
 * settings.
 * @param {SettingsService} settingsService - an initialized settings service.
 * @returns {INetwork[]} the supported networks.
 */
export default async function fetchSupportedNetworks(
  settingsService: SettingsService
): Promise<INetwork[]> {
  const settings: ISettings = await settingsService.getAll();

  return networks.reduce<INetwork[]>((acc, value) => {
    switch (value.type) {
      case NetworkTypeEnum.Beta:
        return [
          ...acc,
          ...(settings.advanced.allowBetaNet ? [value] : []), // only allow betanet networks if the settings has been allowed
        ];
      case NetworkTypeEnum.Stable:
        return [
          ...acc,
          ...(settings.advanced.allowMainNet ? [value] : []), // only allow stable (mainnet) networks if the settings has been allowed
        ];
      case NetworkTypeEnum.Test:
        return [
          ...acc,
          value, // testnets are allowed by default
        ];
      default:
        return acc;
    }
  }, []);
}
