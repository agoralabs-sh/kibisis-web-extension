// types
import type { IAssetTypes } from '@extension/types';

interface IInitializeRemoveAssetsPayload {
  accountId: string;
  selectedAsset: IAssetTypes;
}

export default IInitializeRemoveAssetsPayload;
