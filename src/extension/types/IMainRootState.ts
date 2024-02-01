// features
import { IAccountsState } from '@extension/features/accounts';
import { IAddAssetState } from '@extension/features/add-asset';
import { IArc200AssetsState } from '@extension/features/arc200-assets';
import { IEventsState } from '@extension/features/events';
import { INetworksState } from '@extension/features/networks';
import { INotificationsState } from '@extension/features/notifications';
import { IPasswordLockState } from '@extension/features/password-lock';
import { ISendAssetsState } from '@extension/features/send-assets';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';
import { IStandardAssetsState } from '@extension/features/standard-assets';

// types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  addAsset: IAddAssetState;
  arc200Assets: IArc200AssetsState;
  events: IEventsState;
  networks: INetworksState;
  notifications: INotificationsState;
  passwordLock: IPasswordLockState;
  sendAssets: ISendAssetsState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IMainRootState;
