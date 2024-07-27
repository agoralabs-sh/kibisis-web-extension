// features
import type { IState as IAccountsState } from '@extension/features/accounts';
import type { IState as IAddAssetsState } from '@extension/features/add-assets';
import type { IState as IARC0072AssetsState } from '@extension/features/arc0072-assets';
import type { IState as ICredentialLockState } from '@extension/features/credential-lock';
import type { IState as IEventsState } from '@extension/features/events';
import type { IState as INetworksState } from '@extension/features/networks';
import type { IState as INewsState } from '@extension/features/news';
import type { IState as INotificationsState } from '@extension/features/notifications';
import type { IState as IPasskeysState } from '@extension/features/passkeys';
import type { IState as IReKeyAccountState } from '@extension/features/re-key-account';
import type { IState as IRemoveAssetsState } from '@extension/features/remove-assets';
import type { IState as ISendAssetsState } from '@extension/features/send-assets';
import type { IState as ISessionsState } from '@extension/features/sessions';
import type { IState as ISettingsState } from '@extension/features/settings';
import type { IState as IStandardAssetsState } from '@extension/features/standard-assets';

// types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  addAssets: IAddAssetsState;
  arc0072Assets: IARC0072AssetsState;
  credentialLock: ICredentialLockState;
  events: IEventsState;
  networks: INetworksState;
  news: INewsState;
  notifications: INotificationsState;
  passkeys: IPasskeysState;
  reKeyAccount: IReKeyAccountState;
  removeAssets: IRemoveAssetsState;
  sendAssets: ISendAssetsState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IMainRootState;
