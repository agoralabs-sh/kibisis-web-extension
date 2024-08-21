// types
import type { IBaseOptions } from '@common/types';
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IARC0200Asset, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  asset: IARC0200Asset;
  authAddress: string | null;
  customNode: ICustomNodeItem | null;
  fromAddress: string;
  network: INetwork;
  note: string | null;
  toAddress: string;
}

export default IOptions;
