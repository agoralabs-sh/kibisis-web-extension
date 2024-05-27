// types
import type IAlgorandAssetParams from './IAlgorandAssetParams';

interface IAlgorandAsset {
  ['created-at-round']?: bigint;
  deleted?: boolean;
  ['destroyed-at-round']: bigint;
  index: bigint;
  params: IAlgorandAssetParams;
}

export default IAlgorandAsset;
