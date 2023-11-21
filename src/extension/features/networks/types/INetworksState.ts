// types
import { INetwork } from '@extension/types';

/**
 * @property {INetwork[]} items - the network items.
 */
interface INetworksState {
  items: INetwork[];
}

export default INetworksState;
