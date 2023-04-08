// Types
import { INetwork, ISettings } from '@extension/types';

// Utils
import { selectDefaultNetwork } from '@extension/utils';

/**
 * Creates a default settings object.
 * @param {INetwork[]} networks - the list of networks available.
 * @returns {ISettings} the default settings.
 */
export default function createDefaultSettings(networks: INetwork[]): ISettings {
  return {
    advanced: {
      allowBetaNet: false,
      allowDidTokenFormat: false,
      allowTestNet: false,
    },
    appearance: {
      theme: 'light',
    },
    network: selectDefaultNetwork(networks),
  };
}
