// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IAssetCreateTransaction extends IBaseTransaction {
  clawback: string | null;
  creator: string;
  decimals: number;
  defaultFrozen: boolean;
  freeze: string | null;
  manager: string | null;
  metadataHash: string | null;
  name: string | null;
  reserve: string | null;
  total: string;
  type: TransactionTypeEnum.AssetCreate;
  unitName: string | null;
  url: string | null;
}

export default IAssetCreateTransaction;
