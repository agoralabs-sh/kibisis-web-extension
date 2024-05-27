// types
import type IAlgorandTransaction from './IAlgorandTransaction';

interface IAlgorandAccountTransaction {
  ['current-round']: bigint;
  ['next-token']?: string;
  transactions: IAlgorandTransaction[];
}

export default IAlgorandAccountTransaction;
