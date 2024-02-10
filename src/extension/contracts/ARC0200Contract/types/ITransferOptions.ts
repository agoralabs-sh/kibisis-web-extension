import BigNumber from 'bignumber.js';

interface ITransferOptions {
  amount: BigNumber;
  fromAddress: string;
  note?: string;
  toAddress: string;
}

export default ITransferOptions;
