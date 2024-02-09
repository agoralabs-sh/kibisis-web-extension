// enums
import { ARC0027ErrorCodeEnum, ARC0027ProviderMethodEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

interface IData {
  method: ARC0027ProviderMethodEnum;
}

export default class SerializableARC0027MethodCanceledError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.MethodCanceledError;
  public readonly data: IData;
  public readonly name: string = 'MethodCanceledError';

  constructor(
    method: ARC0027ProviderMethodEnum,
    providerId: string,
    message?: string
  ) {
    super(message || `method "${method}" canceled`, providerId);

    this.data = {
      method,
    };
  }
}
