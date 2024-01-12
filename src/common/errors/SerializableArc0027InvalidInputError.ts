// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

export default class SerializableArc0027InvalidInputError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.InvalidInputError;
  public readonly name: string = 'InvalidInputError';

  constructor(providerId: string, message?: string) {
    super(message || `invalid input in transaction(s)`, providerId);
  }
}
