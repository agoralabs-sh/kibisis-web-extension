// types
import IAlgorandStateSchema from './IAlgorandStateSchema';
import IAlgorandTealKeyValue from './IAlgorandTealKeyValue';

interface IAlgorandApplicationParams {
  ['approval-program']: string;
  ['clear-state-program']: string;
  creator?: string;
  ['extra-program-pages']?: bigint;
  ['global-state']?: IAlgorandTealKeyValue[];
  ['global-state-schema']?: IAlgorandStateSchema;
  ['local-state-schema']?: IAlgorandStateSchema;
}

export default IAlgorandApplicationParams;
