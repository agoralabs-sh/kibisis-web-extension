// Types
import IAssetConfigTransaction from './IAssetConfigTransaction';
import IAssetTransferTransaction from './IAssetTransferTransaction';
import IApplicationTransaction from './IApplicationTransaction';
import IPaymentTransaction from './IPaymentTransaction';
import IUnknownTransaction from './IUnknownTransaction';

type ITransactions =
  | IAssetConfigTransaction
  | IAssetTransferTransaction
  | IPaymentTransaction
  | IApplicationTransaction
  | IUnknownTransaction;

export default ITransactions;
