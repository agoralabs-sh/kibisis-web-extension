// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface IAssetConfigTransaction extends IBaseTransaction {
  assetId: string;
  type: TransactionTypeEnum.AssetConfig;
}

export default IAssetConfigTransaction;
