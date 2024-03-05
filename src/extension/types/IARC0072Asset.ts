// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import IBaseAsset from './IBaseAsset';

/**
 * @property {string} id - the app ID of the ARC-0072 asset.
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this ARC-200 asset.
 * @property {string} totalSupply - the total supply of the ARC-0072 asset.
 * @property {AssetTypeEnum.ARC0072} type - indicates the asset type is of "arc0072".
 */
interface IARC0072Asset extends IBaseAsset {
  id: string;
  totalSupply: string;
  type: AssetTypeEnum.ARC0072;
}

export default IARC0072Asset;
