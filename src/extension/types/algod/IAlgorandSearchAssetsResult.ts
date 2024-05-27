// types
import type IAlgorandAsset from './IAlgorandAsset';

interface IAlgorandSearchAssetsResult {
  assets: IAlgorandAsset[];
  ['current-round']: bigint;
  ['next-token']?: string;
}

export default IAlgorandSearchAssetsResult;
