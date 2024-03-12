// types
import type { IAssetTypes } from '@extension/types';

interface IState {
  accountId: string | null;
  confirming: boolean;
  selectedAsset: IAssetTypes | null;
}

export default IState;
