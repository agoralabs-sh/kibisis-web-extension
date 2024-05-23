// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from './networks';

interface IFetchAssetWithDelayOptions extends IBaseOptions {
  delay: number;
  id: string;
  network: INetwork;
}

export default IFetchAssetWithDelayOptions;
