// Features
import { IAccountsState } from '../features/accounts';
import { IMessagesState } from '../features/messages';
import { INetworksState } from '../features/networks';
import { ISessionsState } from '../features/sessions';
import { ISettingsState } from '../features/settings';

// Types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  messages: IMessagesState;
  networks: INetworksState;
  sessions: ISessionsState;
  settings: ISettingsState;
}

export default IMainRootState;
