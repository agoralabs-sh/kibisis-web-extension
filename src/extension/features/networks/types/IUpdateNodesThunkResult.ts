// types
import type { INode } from '@extension/types';

interface IUpdateNodesThunkResult {
  algod: INode;
  indexer: INode;
}

export default IUpdateNodesThunkResult;
