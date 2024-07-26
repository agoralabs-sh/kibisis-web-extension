import { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// types
import type { IBaseOptions } from '@common/types';
import type {
  IAccountWithExtendedProps,
  IClientRequestEvent,
  INetwork,
  ISession,
} from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - the accounts.
 * @property {IClientRequestEvent<ISignTransactionsParams>} event - a sign transaction event.
 * @property {INetwork[]} networks - the available network.
 * @property {ISession[]} networks - the saved sessions.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  event: IClientRequestEvent<ISignTransactionsParams>;
  networks: INetwork[];
  sessions: ISession[];
}

export default IOptions;
