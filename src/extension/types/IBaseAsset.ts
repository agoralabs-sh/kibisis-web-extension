// enums
import { AssetTypeEnum } from '@extension/enums';

/**
 * @property {string | null} iconUrl - the URL of the asset icon.
 * @property {AssetTypeEnum} type - indicates the type of asset.
 * @property {boolean} verified - whether this asset is verified according to vestige.fi
 */
interface IBaseAsset {
  iconUrl: string | null;
  type: AssetTypeEnum;
  verified: boolean;
}

export default IBaseAsset;
