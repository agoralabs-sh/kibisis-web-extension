// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetFreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetFreeze;
}

export default IAssetFreezeTransaction;
