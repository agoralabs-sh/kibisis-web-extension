// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

// types
import type {
  IARC0200Asset,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IAddAssetsARC0200SummaryModalContentProps {
  asset: IARC0200Asset;
  blockExplorer: BaseBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsARC0200SummaryModalContentProps;
