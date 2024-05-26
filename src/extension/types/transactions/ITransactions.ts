// types
import type IAccountReKeyTransaction from './IAccountReKeyTransaction';
import type IApplicationTransaction from './IApplicationTransaction';
import type IAccountUndoReKeyTransaction from './IAccountUndoReKeyTransaction';
import type IAssetConfigTransaction from './IAssetConfigTransaction';
import type IAssetCreateTransaction from './IAssetCreateTransaction';
import type IAssetDestroyTransaction from './IAssetDestroyTransaction';
import type IAssetFreezeTransaction from './IAssetFreezeTransaction';
import type IAssetTransferTransaction from './IAssetTransferTransaction';
import type IAssetUnfreezeTransaction from './IAssetUnfreezeTransaction';
import type IKeyRegistrationOfflineTransaction from './IKeyRegistrationOfflineTransaction';
import type IKeyRegistrationOnlineTransaction from './IKeyRegistrationOnlineTransaction';
import type IPaymentTransaction from './IPaymentTransaction';
import type IUnknownTransaction from './IUnknownTransaction';

type ITransactions =
  | IAccountReKeyTransaction
  | IAccountUndoReKeyTransaction
  | IApplicationTransaction
  | IAssetConfigTransaction
  | IAssetCreateTransaction
  | IAssetDestroyTransaction
  | IAssetFreezeTransaction
  | IAssetTransferTransaction
  | IAssetUnfreezeTransaction
  | IKeyRegistrationOfflineTransaction
  | IKeyRegistrationOnlineTransaction
  | IPaymentTransaction
  | IUnknownTransaction;

export default ITransactions;
