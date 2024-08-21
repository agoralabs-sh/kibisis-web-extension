// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface INewBaseContractOptions extends IBaseOptions {
  appId: string;
  customNode?: ICustomNodeItem;
  network: INetwork;
}

export default INewBaseContractOptions;
