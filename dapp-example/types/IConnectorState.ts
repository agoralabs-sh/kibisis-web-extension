import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// types
import type { INetwork } from '@extension/types';
import type IAccountInformation from './IAccountInformation';

interface IConnectorState {
  connectAction: (network: INetwork) => Promise<void> | void;
  disconnectAction: () => Promise<void> | void;
  enabledAccounts: IAccountInformation[];
  signTransactionsAction: (
    transactions: IARC0001Transaction[]
  ) => Promise<(string | null)[]> | (string | null)[];
}

export default IConnectorState;
