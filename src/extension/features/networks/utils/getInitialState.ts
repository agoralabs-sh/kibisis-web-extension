// config
import { networks } from '@extension/config';

// types
import { INetworksState } from '../types';

export default function getInitialState(): INetworksState {
  return {
    items: networks,
  };
}
