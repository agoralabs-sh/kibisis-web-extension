// types
import type { IAccount, INetwork } from '@extension/types';

interface IOptions {
  account: IAccount;
  network: INetwork;
  numOfStandardAssets: number;
}

export default IOptions;
