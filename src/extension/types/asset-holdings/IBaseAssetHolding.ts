import { AssetTypeEnum } from '@extension/enums';

/**
 * @property {string} amount - the amount, in atomic units, the asset.
 * @property {string} id - the asset ID.
 * @property {AssetTypeEnum} type - the type of asset.
 */
interface IBaseAssetHolding {
  amount: string;
  id: string;
  type: AssetTypeEnum;
}

export default IBaseAssetHolding;
