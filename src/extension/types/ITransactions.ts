// Types
import IAssetConfigTransaction from './IAssetConfigTransaction';
import IAssetCreateTransaction from './IAssetCreateTransaction';
import IAssetDestroyTransaction from './IAssetDestroyTransaction';
import IAssetFreezeTransaction from './IAssetFreezeTransaction';
import IAssetTransferTransaction from './IAssetTransferTransaction';
import IAssetUnfreezeTransaction from './IAssetUnfreezeTransaction';
import IApplicationTransaction from './IApplicationTransaction';
import IKeyRegistrationOfflineTransaction from './IKeyRegistrationOfflineTransaction';
import IKeyRegistrationOnlineTransaction from './IKeyRegistrationOnlineTransaction';
import IPaymentTransaction from './IPaymentTransaction';
import IUnknownTransaction from './IUnknownTransaction';

type ITransactions =
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
