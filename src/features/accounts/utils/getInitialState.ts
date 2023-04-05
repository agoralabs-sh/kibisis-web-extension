// Types
import { IAccountsState } from '../types';

export default function getInitialState(): IAccountsState {
  return {
    fetching: false,
    items: [],
    saving: false,
  };
}
