// types
import { ISendAssetsState } from '../types';

export default function getInitialState(): ISendAssetsState {
  return {
    amount: null,
    fromAddress: null,
    note: null,
    selectedAsset: null,
    toAddress: null,
  };
}
