// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  fromAddress: string;
  network: INetwork;
  nodeID: string | null;
  note: string | null;
  toAddress: string;
}

export default IOptions;
