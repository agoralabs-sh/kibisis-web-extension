// types
import type {
  IARC0200Asset,
  IBlockExplorer,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IAddAssetsARC0200SummaryModalContentProps {
  asset: IARC0200Asset;
  blockExplorer: IBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsARC0200SummaryModalContentProps;
