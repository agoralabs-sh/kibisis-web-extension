// features
import type { IState as IAccountsState } from '@extension/features/accounts';
import type { IState as IEventsState } from '@extension/features/events';
import type { IState as INetworksState } from '@extension/features/networks';
import type { ISessionsState } from '@extension/features/sessions';
import type { ISettingsState } from '@extension/features/settings';
import type { IStandardAssetsState } from '@extension/features/standard-assets';

// types
import type IBaseRootState from './IBaseRootState';

interface IBackgroundRootState extends IBaseRootState {
  accounts: IAccountsState;
  events: IEventsState;
  networks: INetworksState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IBackgroundRootState;
