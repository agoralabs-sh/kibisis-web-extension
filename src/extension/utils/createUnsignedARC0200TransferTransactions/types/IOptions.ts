// types
import type { IBaseOptions } from '@common/types';
import type { IARC0200Asset, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  asset: IARC0200Asset;
  authAddress: string | null;
  fromAddress: string;
  network: INetwork;
  nodeID: string | null;
  note: string | null;
  toAddress: string;
}

export default IOptions;
