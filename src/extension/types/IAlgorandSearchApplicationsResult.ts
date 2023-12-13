// types
import IAlgorandApplication from './IAlgorandApplication';

interface IAlgorandSearchApplicationsResult {
  applications: IAlgorandApplication[];
  ['current-round']: bigint;
  ['next-token']?: string;
}

export default IAlgorandSearchApplicationsResult;
