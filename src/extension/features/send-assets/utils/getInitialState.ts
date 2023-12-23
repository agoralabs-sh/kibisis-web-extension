// types
import { ISendAssetsState } from '../types';

export default function getInitialState(): ISendAssetsState {
  return {
    amountInStandardUnits: '0',
    confirming: false,
    error: null,
    fromAddress: null,
    note: null,
    selectedAsset: null,
    toAddress: null,
    transactionId: null,
  };
}
