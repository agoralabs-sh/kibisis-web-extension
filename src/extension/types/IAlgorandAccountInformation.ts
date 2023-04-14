// Types
import IAlgorandAssetHolding from './IAlgorandAssetHolding';

interface IAlgorandAccountInformation {
  address: string;
  amount: bigint;
  assets: IAlgorandAssetHolding[];
  ['auth-addr']?: string;
  ['min-balance']: bigint;
}

export default IAlgorandAccountInformation;
