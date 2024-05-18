// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from './networks';

interface IUpdateAssetInformationByIdOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

export default IUpdateAssetInformationByIdOptions;
