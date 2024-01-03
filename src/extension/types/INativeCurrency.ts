// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import IBaseAsset from './IBaseAsset';

interface INativeCurrency extends IBaseAsset {
  decimals: number;
  iconUrl: string;
  listingUri: string;
  symbol: string;
  type: AssetTypeEnum.Native;
  verified: true; // always verified
}

export default INativeCurrency;
