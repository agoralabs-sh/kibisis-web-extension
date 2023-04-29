// Types
import IAssetConfigTransaction from './IAssetConfigTransaction';
import IAssetTransferTransaction from './IAssetTransferTransaction';
import INoOpApplicationTransaction from './INoOpApplicationTransaction';
import IPaymentTransaction from './IPaymentTransaction';
import IUnknownTransaction from './IUnknownTransaction';

type ITransactions =
  | IAssetConfigTransaction
  | IAssetTransferTransaction
  | IPaymentTransaction
  | INoOpApplicationTransaction
  | IUnknownTransaction;

export default ITransactions;
