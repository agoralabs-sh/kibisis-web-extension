// types
import { IARC0200Asset, IAssetTypes, IStandardAsset } from '@extension/types';
import IAssetsWithNextToken from './IAssetsWithNextToken';

interface IState {
  accountId: string | null;
  arc200Assets: IAssetsWithNextToken<IARC0200Asset>;
  confirming: boolean;
  fetching: boolean;
  selectedAsset: IAssetTypes | null;
  standardAssets: IAssetsWithNextToken<IStandardAsset>;
}

export default IState;
