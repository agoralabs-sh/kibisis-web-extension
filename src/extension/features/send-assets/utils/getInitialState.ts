// types
import type { ISendAssetsState } from '../types';

export default function getInitialState(): ISendAssetsState {
  return {
    amountInStandardUnits: '0',
    confirming: false,
    creating: false,
    fromAddress: null,
    note: null,
    selectedAsset: null,
    toAddress: null,
  };
}
