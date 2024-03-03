// types
import type { IARC0200Asset } from '@extension/types';

interface IUseUpdateARC0200AssetsState {
  assets: IARC0200Asset[];
  loading: boolean;
  reset: () => void;
}

export default IUseUpdateARC0200AssetsState;
