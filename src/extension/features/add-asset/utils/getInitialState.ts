// types
import { IAddAssetState } from '../types';

export default function getInitialState(): IAddAssetState {
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
