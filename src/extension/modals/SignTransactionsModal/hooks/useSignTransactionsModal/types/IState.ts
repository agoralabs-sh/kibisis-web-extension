import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientRequestEvent } from '@extension/types';

interface IState {
  event: IClientRequestEvent<ISignTransactionsParams> | null;
}

export default IState;
