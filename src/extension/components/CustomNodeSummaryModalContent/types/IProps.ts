// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork } from '@extension/types';

interface IProps {
  customNode: ICustomNodeItem;
  network: INetwork;
}

export default IProps;
