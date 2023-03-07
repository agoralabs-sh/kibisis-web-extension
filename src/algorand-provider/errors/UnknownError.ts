// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class UnknownError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
