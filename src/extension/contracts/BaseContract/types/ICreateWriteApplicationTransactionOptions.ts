import { BoxReference } from 'algosdk';

// types
import IBaseApplicationOptions from './IBaseApplicationOptions';

interface ICreateWriteApplicationTransactionOptions
  extends IBaseApplicationOptions {
  boxes?: BoxReference[];
  fromAddress: string;
  note?: string;
}

export default ICreateWriteApplicationTransactionOptions;
