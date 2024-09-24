// features
import type { IState as IAccountsState } from '@extension/features/accounts';
import type { IState as ICredentialLockState } from '@extension/features/credential-lock';
import type { IState as IEventsState } from '@extension/features/events';
import type { IState as IPasskeysState } from '@extension/features/passkeys';

// types
import type IBaseRootState from './IBaseRootState';

interface IHardwareWalletRootState extends IBaseRootState {
  accounts: IAccountsState;
  credentialLock: ICredentialLockState;
  events: IEventsState;
  passkeys: IPasskeysState;
}

export default IHardwareWalletRootState;
