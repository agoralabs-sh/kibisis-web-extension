// features
import type { IState as IAccountsState } from '@extension/features/accounts';
import type { IState as ICredentialLockState } from '@extension/features/credential-lock';
import type { IState as IEventsState } from '@extension/features/events';
import type { IState as INetworksState } from '@extension/features/networks';
import type { IState as IPasskeysState } from '@extension/features/passkeys';
import type { IState as ISessionsState } from '@extension/features/sessions';
import type { IState as ISettingsState } from '@extension/features/settings';
import type { IState as IStandardAssetsState } from '@extension/features/standard-assets';

// types
import type IBaseRootState from './IBaseRootState';

interface IBackgroundRootState extends IBaseRootState {
  accounts: IAccountsState;
  credentialLock: ICredentialLockState;
  events: IEventsState;
  networks: INetworksState;
  passkeys: IPasskeysState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IBackgroundRootState;
