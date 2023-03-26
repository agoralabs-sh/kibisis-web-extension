interface IAlgorandAccountInformation {
  address: string;
  amount: bigint;
  ['auth-addr']?: string;
  ['min-balance']: bigint;
}

export default IAlgorandAccountInformation;
