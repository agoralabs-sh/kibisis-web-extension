// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

// types
import type {
  IAccount,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

interface IAddAssetsModalStandardAssetSummaryContentProps {
  account: IAccount;
  accounts: IAccount[];
  asset: IStandardAsset;
  blockExplorer: BaseBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsModalStandardAssetSummaryContentProps;
