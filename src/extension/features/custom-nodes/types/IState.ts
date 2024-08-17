// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';

/**
 * @property {boolean} fetching - true when custom nodes from storage.
 * @property {ICustomNodeItem[]} items - the custom nodes items.
 * @property {boolean} saving - true when custom nodes are being saved to storage.
 */
interface IState {
  fetching: boolean;
  items: ICustomNodeItem[];
  saving: boolean;
}

export default IState;
