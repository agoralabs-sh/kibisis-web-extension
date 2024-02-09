// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

interface IData {
  successTxnIDs: (string | null)[];
}

export default class SerializableARC0027FailedToPostSomeTransactionsError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.FailedToPostSomeTransactionsError;
  public readonly data: IData;
  public readonly name: string = 'FailedToPostSomeTransactionsError';

  constructor(
    successTxnIDs: (string | null)[],
    providerId: string,
    message?: string
  ) {
    super(message || `failed to post some transactions`, providerId);

    this.data = {
      successTxnIDs,
    };
  }
}
