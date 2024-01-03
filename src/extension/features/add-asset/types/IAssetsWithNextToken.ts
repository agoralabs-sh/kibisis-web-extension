// types
import { IAssetTypes } from '@extension/types';

interface IAssetsWithNextToken<Asset = IAssetTypes> {
  items: Asset[];
  next: string | null;
}

export default IAssetsWithNextToken;
