// features
import { IAccountsState } from '@extension/features/accounts';
import { IAssetsState } from '@extension/features/assets';
import { IEventsState } from '@extension/features/events';
import { INetworksState } from '@extension/features/networks';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';

// types
import IBaseRootState from './IBaseRootState';

interface IBackgroundRootState extends IBaseRootState {
  accounts: IAccountsState;
  assets: IAssetsState;
  events: IEventsState;
  networks: INetworksState;
  sessions: ISessionsState;
  settings: ISettingsState;
}

export default IBackgroundRootState;
