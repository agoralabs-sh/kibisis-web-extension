// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetFreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetFreeze;
}

export default IAssetFreezeTransaction;
