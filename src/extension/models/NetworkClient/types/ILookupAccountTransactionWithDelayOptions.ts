// types
import type IByAddressWithDelayOptions from './IByAddressWithDelayOptions';

interface ILookupAccountTransactionWithDelayOptions
  extends IByAddressWithDelayOptions {
  afterTime: number | null;
  limit: number;
  next: string | null;
}

export default ILookupAccountTransactionWithDelayOptions;
