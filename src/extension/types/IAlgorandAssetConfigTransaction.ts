// Types
import IAlgorandAssetParams from './IAlgorandAssetParams';

interface IAlgorandAssetConfigTransaction {
  ['asset-id']: bigint;
  params: IAlgorandAssetParams;
}

export default IAlgorandAssetConfigTransaction;
