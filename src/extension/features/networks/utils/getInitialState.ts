// config
import { networks } from '@extension/config';

// types
import { INetworkWithTransactionParams } from '@extension/types';
import { INetworksState } from '../types';

export default function getInitialState(): INetworksState {
  return {
    fetching: false,
    items: networks.map<INetworkWithTransactionParams>((value) => ({
      ...value,
      fee: '0',
      minFee: '0',
      updatedAt: 0,
    })),
    pollingId: null,
    saving: false,
    updating: false,
  };
}
