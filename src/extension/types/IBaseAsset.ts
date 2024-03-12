// enums
import { AssetTypeEnum } from '@extension/enums';

/**
 * @property {AssetTypeEnum} type - indicates the type of asset.
 * @property {boolean} verified - whether this asset is verified according to vestige.fi
 */
interface IBaseAsset {
  type: AssetTypeEnum;
  verified: boolean;
}

export default IBaseAsset;
