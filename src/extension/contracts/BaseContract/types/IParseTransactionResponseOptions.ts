import algosdk, { ABIMethod } from 'algosdk';
import BigNumber from 'bignumber.js';

interface IParseTransactionResponseOptions {
  abiMethod: ABIMethod;
  appId: BigNumber;
  response: algosdk.modelsv2.PendingTransactionResponse;
}

export default IParseTransactionResponseOptions;
