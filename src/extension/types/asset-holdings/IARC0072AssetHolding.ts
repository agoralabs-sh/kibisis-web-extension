// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import type IARC0003TokenMetadata from './IARC0003TokenMetadata';
import type IBaseAssetHolding from './IBaseAssetHolding';

interface IARC0072AssetHolding extends IBaseAssetHolding {
  metadata: IARC0003TokenMetadata;
  tokenId: string;
  type: AssetTypeEnum.ARC0072;
}

export default IARC0072AssetHolding;
