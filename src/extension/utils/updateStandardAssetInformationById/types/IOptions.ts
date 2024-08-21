// types
import type { IBaseOptions } from '@common/types';
import type { INode, ITinyManAssetResponse } from '@extension/types';

interface IOptions extends IBaseOptions {
  algoNode: INode;
  delay?: number;
  id: string;
  verifiedAssetList: ITinyManAssetResponse[];
}

export default IOptions;
