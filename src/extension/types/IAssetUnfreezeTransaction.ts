// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetUnfreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetUnfreeze;
}

export default IAssetUnfreezeTransaction;
