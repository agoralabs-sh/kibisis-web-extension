// types
import type { IARC0200Asset } from '@extension/types';

interface IUseAccountImportAssets {
  assets: IARC0200Asset[];
  loading: boolean;
  reset: () => void;
}

export default IUseAccountImportAssets;
