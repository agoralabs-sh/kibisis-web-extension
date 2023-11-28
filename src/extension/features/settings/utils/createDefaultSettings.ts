// types
import { INetwork, ISettings } from '@extension/types';

// utils
import { selectDefaultNetwork } from '@extension/utils';

/**
 * Creates a default settings object.
 * @param {INetwork[]} networks - the list of networks available.
 * @returns {ISettings} the default settings.
 */
export default function createDefaultSettings(networks: INetwork[]): ISettings {
  const defaultNetwork: INetwork = selectDefaultNetwork(networks);

  return {
    advanced: {
      allowBetaNet: false,
      allowDidTokenFormat: false,
      allowMainNet: false,
    },
    appearance: {
      theme: 'light',
    },
    general: {
      preferredBlockExplorerId: defaultNetwork.explorers[0]?.id || null,
      selectedNetworkGenesisHash: defaultNetwork.genesisHash,
    },
  };
}
