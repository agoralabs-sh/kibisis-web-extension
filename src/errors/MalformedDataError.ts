// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class MalformedDataError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.MalformedDataError;
  public readonly name: string = 'MalformedDataError';
}
