// types
import type { IBaseOptions } from '@common/types';
import INetwork from './INetwork';

interface IUpdateAssetInformationByIdOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

export default IUpdateAssetInformationByIdOptions;
