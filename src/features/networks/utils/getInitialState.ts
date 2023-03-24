import networks from '../../../networks.json';

// Types
import { INetworksState } from '../types';

export default function getInitialState(): INetworksState {
  return {
    items: networks,
  };
}
