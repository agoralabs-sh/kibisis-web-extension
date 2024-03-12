// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    accountId: null,
    confirming: false,
    selectedAsset: null,
  };
}
