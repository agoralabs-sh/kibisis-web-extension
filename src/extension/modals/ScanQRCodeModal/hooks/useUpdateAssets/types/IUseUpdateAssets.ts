// types
import type { IARC0200Asset } from '@extension/types';

interface IUseUpdateAssets {
  assets: IARC0200Asset[];
  loading: boolean;
  reset: () => void;
}

export default IUseUpdateAssets;
