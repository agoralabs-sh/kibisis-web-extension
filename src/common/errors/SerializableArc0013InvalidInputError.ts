// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

export default class SerializableArc0013InvalidInputError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.InvalidInputError;
  public readonly name: string = 'InvalidInputError';

  constructor(providerId: string, message?: string) {
    super(message || `invalid input in transaction(s)`, providerId);
  }
}
