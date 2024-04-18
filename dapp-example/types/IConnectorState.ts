// types
import type { INetwork } from '@extension/types';
import type IAccountInformation from './IAccountInformation';

interface IConnectorState {
  connectAction: (network: INetwork) => Promise<void> | void;
  disconnectAction: () => Promise<void> | void;
  enabledAccounts: IAccountInformation[];
}

export default IConnectorState;
