// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import IBaseAsset from './IBaseAsset';

/**
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this ARC-0200 asset.
 * @property {string | null} iconUrl - the URL of the asset icon.
 * @property {string} id - the app ID of the ARC-0200 asset.
 * @property {string} name - the utf-8 name of the ARC-0200 asset.
 * @property {string} symbol - the utf-8 symbol of the ARC-0200 asset.
 * @property {string} totalSupply - the total supply of this ARC-0200 asset.
 * @property {AssetTypeEnum.ARC0200} type - indicates the asset type is of "arc200".
 */
interface IARC0200Asset extends IBaseAsset {
  decimals: number;
  iconUrl: string | null;
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  type: AssetTypeEnum.ARC0200;
}

export default IARC0200Asset;
