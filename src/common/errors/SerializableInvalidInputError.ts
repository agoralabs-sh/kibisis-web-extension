import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// Errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableInvalidInputError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidInputError;
  public readonly name: string = 'InvalidInputError';
}
