// types
import { IState } from '../types';

export default function getInitialState(): IState {
  return {
    activeAccountDetails: null,
    fetching: false,
    items: [],
    pollingId: null,
    saving: false,
    updatingAccounts: [],
  };
}
