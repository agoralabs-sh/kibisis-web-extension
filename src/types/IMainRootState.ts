// Features
import { IAccountsState } from '../features/accounts';

// Types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
}

export default IMainRootState;
