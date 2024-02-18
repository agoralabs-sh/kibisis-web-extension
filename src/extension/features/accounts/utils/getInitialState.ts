// types
import { IAccountsState } from '../types';

export default function getInitialState(): IAccountsState {
  return {
    activeAccountDetails: null,
    fetching: false,
    items: [],
    pollingId: null,
    saving: false,
    updatingAccounts: [],
  };
}
