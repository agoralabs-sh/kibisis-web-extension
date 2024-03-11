// types
import type {
  IAccount,
  IBlockExplorer,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

interface IAddAssetsModalStandardAssetSummaryContentProps {
  account: IAccount;
  accounts: IAccount[];
  asset: IStandardAsset;
  blockExplorer: IBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsModalStandardAssetSummaryContentProps;
