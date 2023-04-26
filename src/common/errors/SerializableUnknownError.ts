import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// Errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableUnknownError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
