import algosdk, { ABIMethod } from 'algosdk';

interface IParseTransactionResponseOptions {
  abiMethod: ABIMethod;
  response: algosdk.modelsv2.PendingTransactionResponse;
}

export default IParseTransactionResponseOptions;
