// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetFreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetFreeze;
}

export default IAssetFreezeTransaction;
