// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

export default class SerializableARC0027InvalidInputError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.InvalidInputError;
  public readonly name: string = 'InvalidInputError';

  constructor(providerId: string, message?: string) {
    super(message || `invalid input in transaction(s)`, providerId);
  }
}
