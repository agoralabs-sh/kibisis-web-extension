// types
import type { INetwork } from '@extension/types';
import type IAccountInformation from './IAccountInformation';
import type TSignMessageAction from './TSignMessageAction';
import type TSignTransactionsAction from './TSignTransactionsAction';

interface IConnectorState {
  connectAction: (network: INetwork) => Promise<void> | void;
  disconnectAction: () => Promise<void> | void;
  enabledAccounts: IAccountInformation[];
  signMessageAction: TSignMessageAction;
  signTransactionsAction: TSignTransactionsAction;
}

export default IConnectorState;
