// config
import { networks } from '@extension/config';

// types
import type { INetworkWithTransactionParams } from '@extension/types';
import type { IState } from '../types';

export default function getInitialState(): IState {
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
