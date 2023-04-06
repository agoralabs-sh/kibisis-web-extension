// Types
import { IAccountsState } from '../types';

export default function getInitialState(): IAccountsState {
  return {
    fetching: false,
    items: [],
    pollingId: null,
    saving: false,
    updating: false,
  };
}
