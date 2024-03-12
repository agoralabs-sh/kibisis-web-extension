// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    accountId: null,
    arc200Assets: {
      items: [],
      next: null,
    },
    confirming: false,
    fetching: false,
    selectedAsset: null,
    standardAssets: {
      items: [],
      next: null,
    },
  };
}
