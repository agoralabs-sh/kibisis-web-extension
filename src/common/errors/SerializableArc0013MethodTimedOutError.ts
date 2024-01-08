// enums
import { Arc0013ErrorCodeEnum, Arc0013ProviderMethodEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  method: Arc0013ProviderMethodEnum;
}

export default class SerializableArc0013MethodTimedOutError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.MethodTimedOutError;
  public readonly data: IData;
  public readonly name: string = 'MethodTimedOutError';

  constructor(
    method: Arc0013ProviderMethodEnum,
    providerId: string,
    message?: string
  ) {
    super(message || `method "${method}" timed out`, providerId);

    this.data = {
      method,
    };
  }
}
