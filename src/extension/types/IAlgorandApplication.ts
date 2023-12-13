// types
import IAlgorandApplicationParams from './IAlgorandApplicationParams';

interface IAlgorandApplication {
  ['created-at-round']?: bigint;
  deleted?: boolean;
  ['destroyed-at-round']: bigint;
  id: bigint;
  params: IAlgorandApplicationParams;
}

export default IAlgorandApplication;
