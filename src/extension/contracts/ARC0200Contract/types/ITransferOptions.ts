import BigNumber from 'bignumber.js';

interface ITransferOptions {
  amountInAtomicUnits: BigNumber;
  fromAddress: string;
  note?: string;
  toAddress: string;
}

export default ITransferOptions;
