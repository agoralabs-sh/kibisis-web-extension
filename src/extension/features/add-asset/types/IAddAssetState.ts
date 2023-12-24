// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IArc200Asset, IStandardAsset } from '@extension/types';
import IAssetsWithNextToken from './IAssetsWithNextToken';

interface IAddAssetState {
  accountId: string | null;
  arc200Assets: IAssetsWithNextToken<IArc200Asset>;
  error: BaseExtensionError | null;
  fetching: boolean;
  selectedAsset: IArc200Asset | IStandardAsset | null;
  standardAssets: IAssetsWithNextToken<IStandardAsset>;
}

export default IAddAssetState;
