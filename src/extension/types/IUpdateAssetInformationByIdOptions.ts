// types
import type { IBaseOptions } from '@common/types';
import type { TCustomNodeItemOrNetwork } from './networks';

interface IUpdateAssetInformationByIdOptions extends IBaseOptions {
  customNodeOrNetwork: TCustomNodeItemOrNetwork;
  delay?: number;
  id: string;
}

export default IUpdateAssetInformationByIdOptions;
