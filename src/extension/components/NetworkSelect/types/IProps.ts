// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork } from '@extension/types';

interface IProps {
  context: string;
  customNodes: ICustomNodeItem[];
  networks: INetwork[];
  onSelect: (value: ICustomNodeItem | INetwork) => void;
  selectedCustomNode?: ICustomNodeItem;
  selectedNetwork: INetwork;
}

export default IProps;
