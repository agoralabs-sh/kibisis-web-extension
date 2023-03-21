// Features
import { IAccountsState } from '../features/accounts';
import { ISessionsState } from '../features/sessions';

// Types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  sessions: ISessionsState;
}

export default IMainRootState;
