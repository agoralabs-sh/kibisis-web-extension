// enums
import { Arc0013ErrorCodeEnum, Arc0013ProviderMethodEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  method: Arc0013ProviderMethodEnum;
}

export default class SerializableArc0013MethodSupportedError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.MethodNotSupportedError;
  public readonly data: IData;
  public readonly name: string = 'MethodNotSupportedError';

  constructor(
    method: Arc0013ProviderMethodEnum,
    providerId: string,
    message?: string
  ) {
    super(
      message || `method "${method}" not supported for provider ${providerId}`,
      providerId
    );

    this.data = {
      method,
    };
  }
}
