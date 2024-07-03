import { ABIMethod, Transaction } from 'algosdk';

interface ISimulateTransaction {
  abiMethod: ABIMethod;
  authAddress?: string;
  transaction: Transaction;
}

export default ISimulateTransaction;
