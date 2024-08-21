// types
import type { IBaseOptions } from '@common/types';
import type { TCustomNodeItemOrNetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  customNodeOrNetwork: TCustomNodeItemOrNetwork;
  fromAddress: string;
  note: string | null;
  toAddress: string;
}

export default IOptions;
