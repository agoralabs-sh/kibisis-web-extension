// Types
import IAlgorandStateSchema from './IAlgorandStateSchema';

interface IAlgorandApplicationTransaction {
  accounts?: string[];
  ['application-args']?: string[];
  ['application-id']: bigint;
  ['approval-program']?: string;
  ['clear-state-program']?: string;
  ['extra-program-pages']?: bigint;
  ['foreign-apps']?: bigint[];
  ['foreign-assets']?: bigint[];
  ['global-state-schema']?: IAlgorandStateSchema;
  ['local-state-schema']?: IAlgorandStateSchema;
  ['on-completion']:
    | 'clear'
    | 'closeout'
    | 'delete'
    | 'noop'
    | 'optin'
    | 'update';
}

export default IAlgorandApplicationTransaction;
