// types
import type { IBaseOptions } from '@common/types';
import type {
  IStandardAsset,
  TCustomNodeItemOrNetwork,
} from '@extension/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  asset: IStandardAsset;
  customNodeOrNetwork: TCustomNodeItemOrNetwork;
  fromAddress: string;
  note: string | null;
  toAddress: string;
}

export default IOptions;
