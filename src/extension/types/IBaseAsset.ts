// enums
import { AssetTypeEnum } from '@extension/enums';

/**
 * @property {string} id - the id of the asset. For app-based assets, this represents the application ID, for standard
 * assets, this represents the asset index.
 * @property {AssetTypeEnum} type - indicates the type of asset.
 * @property {boolean} verified - whether this asset is verified according to vestige.fi
 */
interface IBaseAsset {
  type: AssetTypeEnum;
  verified: boolean;
}

export default IBaseAsset;
