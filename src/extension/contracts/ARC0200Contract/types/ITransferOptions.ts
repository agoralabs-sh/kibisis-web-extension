import BigNumber from 'bignumber.js';

interface ITransferOptions {
  amountInAtomicUnits: BigNumber;
  authAddress?: string;
  fromAddress: string;
  note?: string;
  toAddress: string;
}

export default ITransferOptions;
