import BigNumber from 'bignumber.js';

// types
import type { ITransactionParams } from '@extension/types';

interface IOptions {
  boxStorageFee: BigNumber;
  numOfARC0200Assets: number;
  numOfStandardAssets: number;
  transactionParams: ITransactionParams;
}

export default IOptions;
