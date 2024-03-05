// types
import type { IBaseOptions } from '@common/types';
import INetwork from './INetwork';

interface IFetchAssetWithDelayOptions extends IBaseOptions {
  delay: number;
  id: string;
  network: INetwork;
}

export default IFetchAssetWithDelayOptions;
