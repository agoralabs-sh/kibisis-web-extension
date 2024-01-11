// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  successTxnIDs: (string | null)[];
}

export default class SerializableArc0013FailedToPostSomeTransactionsError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.FailedToPostSomeTransactionsError;
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
