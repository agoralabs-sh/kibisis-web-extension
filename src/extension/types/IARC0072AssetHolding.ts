// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import { IARC0003TokenMetadata, IBaseAssetHolding } from '@extension/types';

interface IARC0072AssetHolding extends IBaseAssetHolding {
  metadata: IARC0003TokenMetadata;
  tokenId: string;
  type: AssetTypeEnum.ARC0072;
}

export default IARC0072AssetHolding;
