// enums
import { Arc0027ErrorCodeEnum, Arc0027ProviderMethodEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  method: Arc0027ProviderMethodEnum;
}

export default class SerializableArc0027MethodSupportedError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.MethodNotSupportedError;
  public readonly data: IData;
  public readonly name: string = 'MethodNotSupportedError';

  constructor(
    method: Arc0027ProviderMethodEnum,
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
