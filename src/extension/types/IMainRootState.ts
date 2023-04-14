// Features
import { IAccountsState } from '@extension/features/accounts';
import { IAssetsState } from '@extension/features/assets';
import { IMessagesState } from '@extension/features/messages';
import { INetworksState } from '@extension/features/networks';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';

// Types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  assets: IAssetsState;
  messages: IMessagesState;
  networks: INetworksState;
  sessions: ISessionsState;
  settings: ISettingsState;
}

export default IMainRootState;
