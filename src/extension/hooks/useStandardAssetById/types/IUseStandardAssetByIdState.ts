// types
import { IAsset } from '@extension/types';

interface IUseStandardAssetByIdState {
  standardAsset: IAsset | null;
  updating: boolean;
}

export default IUseStandardAssetByIdState;
