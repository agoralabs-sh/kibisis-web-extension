import { ABIMethod } from 'algosdk';
import BigNumber from 'bignumber.js';

interface ICreateReadApplicationTransactionOptions {
  abiMethod: ABIMethod;
  appId: BigNumber;
  appArgs?: Uint8Array[];
}

export default ICreateReadApplicationTransactionOptions;
