// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  successTxnIDs: (string | null)[];
}

export default class SerializableArc0027FailedToPostSomeTransactionsError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.FailedToPostSomeTransactionsError;
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
