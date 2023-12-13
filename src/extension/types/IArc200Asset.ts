/**
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this ARC-200 asset.
 * @property {string} id - the app ID of the ARC-200 asset.
 * @property {string | null} iconUrl - the URL of the asset icon.
 * @property {string} name - the utf-8 name of the ARC-200 asset.
 * @property {string} symbol - the utf-8 symbol of the ARC-200 asset.
 * @property {string} totalSupply - the total supply of this ARC-200 asset.
 * @property {boolean} verified - whether this ARC-200 asset is verified.
 */
interface IArc200Asset {
  decimals: number;
  iconUrl: string | null;
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  verified: boolean;
}

export default IArc200Asset;
