// Types
import IAlgorandAssetParams from './IAlgorandAssetParams';

interface IBaseAlgorandTransaction {
  ['auth-addr']?: string;
  ['close-rewards']?: bigint;
  fee: bigint;
  ['first-valid']: bigint;
  group?: string;
  id?: string;
  ['inner-txns']?: IAlgorandTransaction[];
  ['last-valid']: bigint;
  note?: string;
  ['round-time']?: bigint;
  sender: string;
}

interface IAlgorandApplicationTransaction {
  ['application-id']: bigint;
  ['on-completion']:
    | 'clear'
    | 'closeout'
    | 'delete'
    | 'noop'
    | 'optin'
    | 'update';
}

interface IAlgorandAssetConfigTransaction {
  ['asset-id']: bigint;
  params: IAlgorandAssetParams;
}

interface IAlgorandAssetTransferTransaction {
  amount: bigint;
  ['asset-id']: bigint;
  ['close-amount']?: bigint;
  ['close-to']?: string;
  receiver: string;
  sender?: string;
}

interface IAlgorandPaymentTransaction {
  amount: bigint;
  ['close-amount']?: bigint;
  ['close-remainder-to']?: bigint;
  receiver: string;
}

type IAlgorandTransactions =
  | {
      ['asset-config-transaction']: IAlgorandAssetConfigTransaction;
      ['tx-type']: 'acfg';
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
      ['payment-transaction']: IAlgorandPaymentTransaction;
      ['tx-type']: 'pay';
    };

type IAlgorandTransaction = IBaseAlgorandTransaction & IAlgorandTransactions;

export default IAlgorandTransaction;
