// features
import { IAccountsState } from '@extension/features/accounts';
import { IEventsState } from '@extension/features/events';
import { INetworksState } from '@extension/features/networks';
import { INotificationsState } from '@extension/features/notifications';
import { ISendAssetsState } from '@extension/features/send-assets';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';
import { IStandardAssetsState } from '@extension/features/standard-assets';

// types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  events: IEventsState;
  networks: INetworksState;
  notifications: INotificationsState;
  sendAssets: ISendAssetsState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IMainRootState;
