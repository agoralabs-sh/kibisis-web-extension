// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IArc200Asset } from '@extension/types';
import IAssetsWithNextToken from './IAssetsWithNextToken';

interface IAddAssetState {
  arc200Assets: IAssetsWithNextToken<IArc200Asset>;
  error: BaseExtensionError | null;
  fetching: boolean;
  selectedArc200Asset: IArc200Asset | null;
}

export default IAddAssetState;
