// types
import type { IBaseOptions } from '@common/types';
import type { INetwork, IStandardAsset } from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  asset: IStandardAsset;
  fromAddress: string;
  network: INetwork;
  note: string | null;
  toAddress: string;
}

export default IOptions;
