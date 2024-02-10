import { ABIMethod } from 'algosdk';

interface ICreateReadApplicationTransactionOptions {
  abiMethod: ABIMethod;
  appArgs?: Uint8Array[];
}

export default ICreateReadApplicationTransactionOptions;
