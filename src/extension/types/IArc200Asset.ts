// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import IBaseAsset from './IBaseAsset';

/**
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this ARC-200 asset.
 * @property {string} id - the app ID of the ARC-200 asset.
 * @property {string} name - the utf-8 name of the ARC-200 asset.
 * @property {string} symbol - the utf-8 symbol of the ARC-200 asset.
 * @property {string} totalSupply - the total supply of this ARC-200 asset.
 * @property {AssetTypeEnum.Standard} type - indicates the asset type is of "arc200".
 */
interface IArc200Asset extends IBaseAsset {
  decimals: number;
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  type: AssetTypeEnum.Arc200;
}

export default IArc200Asset;
