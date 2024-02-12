// types
import type { IARC0200Asset } from '@extension/types';

interface IUpdateARC0200AssetHoldingsPayload {
  accountId: string;
  assets: IARC0200Asset[];
  genesisHash: string;
}

export default IUpdateARC0200AssetHoldingsPayload;
