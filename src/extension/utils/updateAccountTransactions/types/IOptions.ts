// types
import type { IBaseOptions } from '@common/types';
import type { IAccountTransactions, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  address: string;
  currentAccountTransactions: IAccountTransactions;
  delay?: number;
  network: INetwork;
  refresh?: boolean;
}

export default IOptions;
