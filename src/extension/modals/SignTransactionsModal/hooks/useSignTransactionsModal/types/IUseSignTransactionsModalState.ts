import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// types
import type {
  IAccountWithExtendedProps,
  IClientRequestEvent,
} from '@extension/types';

interface IUseSignTransactionsModalState {
  authorizedAccounts: IAccountWithExtendedProps[] | null;
  event: IClientRequestEvent<ISignTransactionsParams> | null;
  setAuthorizedAccounts: (
    authorizedAccounts: IAccountWithExtendedProps[] | null
  ) => void;
}

export default IUseSignTransactionsModalState;
