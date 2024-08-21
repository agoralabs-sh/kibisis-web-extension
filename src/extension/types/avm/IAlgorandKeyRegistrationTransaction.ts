interface IAlgorandKeyRegistrationTransaction {
  ['non-participation']?: boolean;
  ['selection-participation-key']?: string;
  ['state-proof-key']?: string;
  ['vote-first-valid']?: bigint;
  ['vote-key-dilution']?: bigint;
  ['vote-last-valid']?: bigint;
  ['vote-participation-key']?: string;
}

export default IAlgorandKeyRegistrationTransaction;
