// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork } from '@extension/types';

interface IAddCustomNodeSummaryModalContentProps {
  customNode: ICustomNodeItem;
  network: INetwork;
}

export default IAddCustomNodeSummaryModalContentProps;
