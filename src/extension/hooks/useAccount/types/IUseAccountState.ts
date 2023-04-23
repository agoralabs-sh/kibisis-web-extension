// Types
import { IAccount } from '@extension/types';

interface IUseAccountState {
  account: IAccount | null;
  fetching: boolean;
}

export default IUseAccountState;
