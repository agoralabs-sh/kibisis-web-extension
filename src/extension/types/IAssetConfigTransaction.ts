// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface IAssetConfigTransaction extends IBaseTransaction {
  assetId: string;
  clawback: string;
  creator: string;
  decimals: number;
  defaultFrozen: boolean;
  freeze: string;
  manager: string;
  reserve: string;
  total: string;
  type: TransactionTypeEnum.AssetConfig;
}

export default IAssetConfigTransaction;
