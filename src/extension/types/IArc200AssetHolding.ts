// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import { IBaseAssetHolding } from '@extension/types';

interface IArc200AssetHolding extends IBaseAssetHolding {
  type: AssetTypeEnum.Arc200;
}

export default IArc200AssetHolding;
