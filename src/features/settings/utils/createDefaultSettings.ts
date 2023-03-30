// Types
import { INetwork, ISettings } from '../../../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';

/**
 * Creates a default settings object.
 * @param {INetwork[]} networks - the list of networks available.
 * @returns {ISettings} the default settings.
 */
export default function createDefaultSettings(networks: INetwork[]): ISettings {
  return {
    advanced: {
      allowBetaNet: false,
      allowTestNet: false,
    },
    network: selectDefaultNetwork(networks),
  };
}
