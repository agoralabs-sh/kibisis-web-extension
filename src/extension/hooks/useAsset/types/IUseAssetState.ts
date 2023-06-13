// Types
import { IAsset } from '@extension/types';

interface IUseAssetState {
  asset: IAsset | null;
  updating: boolean;
}

export default IUseAssetState;
