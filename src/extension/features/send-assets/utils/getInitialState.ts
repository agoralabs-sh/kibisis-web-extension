// types
import type { IState } from '../types';

export default function getInitialState(): IState {
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
