// types
import { IArc200Asset, IStandardAsset } from '@extension/types';

interface IAssetsWithNextToken<Asset = IArc200Asset | IStandardAsset> {
  items: Asset[];
  next: string | null;
}

export default IAssetsWithNextToken;
