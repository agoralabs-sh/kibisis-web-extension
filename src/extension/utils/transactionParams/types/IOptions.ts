// types
import type { IBaseOptions } from '@common/types';
import type { INode } from '@extension/types';

interface IOptions extends IBaseOptions {
  algodNode: INode;
}

export default IOptions;
