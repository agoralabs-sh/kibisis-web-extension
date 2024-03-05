// constants
import { PASSWORD_LOCK_DURATION_NORMAL } from '@extension/constants';

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
      preferredNFTExplorerIds: {},
      selectedNetworkGenesisHash: null,
    },
    saving: false,
    security: {
      passwordLockTimeoutDuration: PASSWORD_LOCK_DURATION_NORMAL,
      enablePasswordLock: false,
    },
  };
}
