// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import { IBaseAssetHolding } from '@extension/types';

/**
 * @property {boolean} isFrozen - whether this standard asset is frozen.
 */
interface IStandardAssetHolding extends IBaseAssetHolding {
  isFrozen: boolean;
  type: AssetTypeEnum.Standard;
}

export default IStandardAssetHolding;
