import algosdk, { ABIMethod } from 'algosdk';
import BigNumber from 'bignumber.js';

interface IParseReadResponseOptions {
  abiMethod: ABIMethod;
  appId: BigNumber;
  methodName: string;
  response: algosdk.modelsv2.SimulateResponse;
}

export default IParseReadResponseOptions;
