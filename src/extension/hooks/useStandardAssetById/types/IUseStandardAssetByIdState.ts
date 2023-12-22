// types
import { IStandardAsset } from '@extension/types';

interface IUseStandardAssetByIdState {
  standardAsset: IStandardAsset | null;
  updating: boolean;
}

export default IUseStandardAssetByIdState;
