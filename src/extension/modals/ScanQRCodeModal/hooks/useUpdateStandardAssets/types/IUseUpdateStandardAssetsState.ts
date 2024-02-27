// types
import type { IStandardAsset } from '@extension/types';

interface IUseUpdateStandardAssetsState {
  assets: IStandardAsset[];
  loading: boolean;
  reset: () => void;
}

export default IUseUpdateStandardAssetsState;
