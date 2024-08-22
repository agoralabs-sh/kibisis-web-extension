// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from './networks';

interface IUpdateAssetInformationByIdOptions extends IBaseOptions {
  delay?: number;
  id: string;
  network: INetwork;
  nodeID: string | null;
}

export default IUpdateAssetInformationByIdOptions;
