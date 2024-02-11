import { ABIMethod, SuggestedParams } from 'algosdk';

interface IBaseApplicationOptions {
  abiMethod: ABIMethod;
  appArgs?: Uint8Array[];
  suggestedParams?: SuggestedParams;
}

export default IBaseApplicationOptions;
