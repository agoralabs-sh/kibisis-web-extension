// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork } from '@extension/types';

interface IProps {
  item: ICustomNodeItem;
  isDisabled?: boolean;
  network: INetwork;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

export default IProps;
