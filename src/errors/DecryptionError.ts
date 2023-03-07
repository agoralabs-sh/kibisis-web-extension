// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class DecryptionError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.DecryptionError;
  public readonly name: string = 'DecryptionError';
}
