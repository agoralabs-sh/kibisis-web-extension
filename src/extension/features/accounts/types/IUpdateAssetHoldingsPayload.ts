// types
import type { IAssetTypes } from '@extension/types';

interface IUpdateAssetHoldingsPayload<AssetType = IAssetTypes> {
  accountId: string;
  assets: AssetType[];
  genesisHash: string;
}

export default IUpdateAssetHoldingsPayload;
