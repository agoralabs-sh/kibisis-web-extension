import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';

// types
import type {
  IAccountWithExtendedProps,
  IClientRequestEvent,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUseEnableModalState {
  availableAccounts: IAccountWithExtendedProps[] | null;
  event: IClientRequestEvent<IEnableParams> | null;
  network: INetworkWithTransactionParams | null;
  setAvailableAccounts: (accounts: IAccountWithExtendedProps[] | null) => void;
  setNetwork: (network: INetworkWithTransactionParams | null) => void;
}

export default IUseEnableModalState;
