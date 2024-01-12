// enums
import { Arc0027ErrorCodeEnum, Arc0027ProviderMethodEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  method: Arc0027ProviderMethodEnum;
}

export default class SerializableArc0027MethodTimedOutError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.MethodTimedOutError;
  public readonly data: IData;
  public readonly name: string = 'MethodTimedOutError';

  constructor(
    method: Arc0027ProviderMethodEnum,
    providerId: string,
    message?: string
  ) {
    super(message || `method "${method}" timed out`, providerId);

    this.data = {
      method,
    };
  }
}
