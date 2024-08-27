// constants
import { CREDENTIALS_LOCK_DURATION_NORMAL } from '@extension/constants';

// types
import type { IState } from '../types';

export default function getInitialState(): IState {
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
      selectedNodeIDs: {},
    },
    privacy: {
      allowActionTracking: false,
    },
    saving: false,
    security: {
      credentialLockTimeoutDuration: CREDENTIALS_LOCK_DURATION_NORMAL,
      enableCredentialLock: false,
    },
  };
}
