// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    activeAccountDetails: null,
    fetching: false,
    groups: [],
    items: [],
    pollingId: null,
    saving: false,
    updateRequests: [],
  };
}
