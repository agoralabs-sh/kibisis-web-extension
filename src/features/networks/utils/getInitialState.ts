import networks from '../../../networks';

// Types
import { INetworksState } from '../types';

export default function getInitialState(): INetworksState {
  return {
    items: networks,
  };
}
