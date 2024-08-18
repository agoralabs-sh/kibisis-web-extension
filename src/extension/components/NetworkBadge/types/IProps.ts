// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { INetwork, TSizes } from '@extension/types';

interface IProps {
  customNode?: ICustomNodeItem;
  network: INetwork;
  size?: TSizes;
}

export default IProps;
