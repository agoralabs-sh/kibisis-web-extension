import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';

// types
import type {
  IClientRequestEvent,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUseEnableModalState {
  authorizedAddresses: string[];
  event: IClientRequestEvent<IEnableParams> | null;
  network: INetworkWithTransactionParams | null;
  setAuthorizedAddresses: (addresses: string[]) => void;
  setNetwork: (network: INetworkWithTransactionParams | null) => void;
}

export default IUseEnableModalState;
