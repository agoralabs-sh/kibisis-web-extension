// types
import type IAlgorandTransaction from './IAlgorandTransaction';

interface IAlgorandPendingTransactionResponse {
  ['application-index']?: bigint;
  ['asset-closing-amount']?: bigint;
  ['asset-index']?: bigint;
  ['close-rewards']?: bigint;
  ['closing-amount']?: bigint;
  ['confirmed-round']?: bigint;
  ['pool-error']: string;
  ['receiver-rewards']?: bigint;
  ['sender-rewards']?: bigint;
  ['txn ']: IAlgorandTransaction;
}

export default IAlgorandPendingTransactionResponse;
