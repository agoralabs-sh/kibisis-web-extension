// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IBaseTransaction from './IBaseTransaction';

interface IAssetDestroyTransaction extends IBaseTransaction {
  assetId: string;
  creator: string;
  decimals: number;
  defaultFrozen: boolean;
  total: string;
  type: TransactionTypeEnum.AssetDestroy;
}

export default IAssetDestroyTransaction;
