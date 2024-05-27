// types
import type IAlgorandApplicationTransaction from './IAlgorandApplicationTransaction';
import type IAlgorandAssetConfigTransaction from './IAlgorandAssetConfigTransaction';
import type IAlgorandAssetFreezeTransaction from './IAlgorandAssetFreezeTransaction';
import type IAlgorandAssetTransferTransaction from './IAlgorandAssetTransferTransaction';
import type IAlgorandKeyRegistrationTransaction from './IAlgorandKeyRegistrationTransaction';
import type IAlgorandPaymentTransaction from './IAlgorandPaymentTransaction';

interface IBaseAlgorandTransaction {
  ['auth-addr']?: string;
  ['close-rewards']?: bigint;
  fee: bigint;
  ['first-valid']: bigint;
  ['genesis-hash']?: string;
  ['genesis-id']?: string;
  group?: string;
  id?: string;
  ['inner-txns']?: IAlgorandTransaction[];
  ['last-valid']: bigint;
  lease?: string;
  note?: string;
  ['rekey-to']?: string;
  ['round-time']?: bigint;
  sender: string;
}

type IAlgorandTransactions =
  | {
      ['asset-config-transaction']: IAlgorandAssetConfigTransaction;
      ['tx-type']: 'acfg';
    }
  | {
      ['asset-freeze-transaction']: IAlgorandAssetFreezeTransaction;
      ['tx-type']: 'afrz';
    }
  | {
      ['application-transaction']: IAlgorandApplicationTransaction;
      ['tx-type']: 'appl';
    }
  | {
      ['asset-transfer-transaction']: IAlgorandAssetTransferTransaction;
      ['tx-type']: 'axfer';
    }
  | {
      ['keyreg-transaction']: IAlgorandKeyRegistrationTransaction;
      ['tx-type']: 'keyreg';
    }
  | {
      ['payment-transaction']: IAlgorandPaymentTransaction;
      ['tx-type']: 'pay';
    };

type IAlgorandTransaction = IBaseAlgorandTransaction & IAlgorandTransactions;

export default IAlgorandTransaction;
