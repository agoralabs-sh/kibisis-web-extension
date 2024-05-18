// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetUnfreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetUnfreeze;
}

export default IAssetUnfreezeTransaction;
