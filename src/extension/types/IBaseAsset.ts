// enums
import { AssetTypeEnum } from '@extension/enums';

/**
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this asset.
 * @property {AssetTypeEnum} type - indicates the type of asset.
 * @property {boolean} verified - whether this asset is verified according to vestige.fi
 */
interface IBaseAsset {
  decimals: number;
  type: AssetTypeEnum;
  verified: boolean;
}

export default IBaseAsset;
