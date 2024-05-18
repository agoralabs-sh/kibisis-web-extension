// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import type IBaseAssetHolding from './IBaseAssetHolding';

interface IARC0200AssetHolding extends IBaseAssetHolding {
  type: AssetTypeEnum.ARC0200;
}

export default IARC0200AssetHolding;
