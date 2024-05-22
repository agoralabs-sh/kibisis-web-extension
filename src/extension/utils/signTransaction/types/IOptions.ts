import type { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  networks: INetwork[];
  password: string;
  unsignedTransaction: Transaction;
}

export default IOptions;
