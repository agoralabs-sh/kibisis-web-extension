// features
import { IAccountsState } from '@extension/features/accounts';
import { IAssetsState } from '@extension/features/assets';
import { IMessagesState } from '@extension/features/messages';
import { INetworksState } from '@extension/features/networks';
import { ISendAssetsState } from '@extension/features/send-assets';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';

// types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  assets: IAssetsState;
  messages: IMessagesState;
  networks: INetworksState;
  sendAssets: ISendAssetsState;
  sessions: ISessionsState;
  settings: ISettingsState;
}

export default IMainRootState;
