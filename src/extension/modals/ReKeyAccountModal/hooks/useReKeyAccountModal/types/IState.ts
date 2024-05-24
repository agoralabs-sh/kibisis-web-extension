// types
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IState {
  account: IAccountWithExtendedProps | null;
  accountInformation: IAccountInformation | null;
  confirming: boolean;
  network: INetworkWithTransactionParams | null;
}

export default IState;
