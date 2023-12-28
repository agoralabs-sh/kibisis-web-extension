// types
import { ISettingsState } from '../types';

export default function getInitialState(): ISettingsState {
  return {
    advanced: {
      allowBetaNet: false,
      allowDidTokenFormat: false,
      allowMainNet: false,
      debugLogging: false,
    },
    appearance: {
      theme: 'light',
    },
    fetching: false,
    general: {
      preferredBlockExplorerIds: {},
      selectedNetworkGenesisHash: null,
    },
    saving: false,
  };
}
