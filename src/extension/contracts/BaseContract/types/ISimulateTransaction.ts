import { ABIMethod, Transaction } from 'algosdk';

interface ISimulateTransaction {
  abiMethod: ABIMethod;
  transaction: Transaction;
}

export default ISimulateTransaction;
