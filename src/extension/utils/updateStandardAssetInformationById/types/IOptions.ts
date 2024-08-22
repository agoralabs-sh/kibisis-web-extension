// types
import type { IBaseOptions } from '@common/types';
import type { INetwork, ITinyManAssetResponse } from '@extension/types';

interface IOptions extends IBaseOptions {
  delay?: number;
  id: string;
  network: INetwork;
  nodeID: string | null;
  verifiedAssetList: ITinyManAssetResponse[];
}

export default IOptions;
