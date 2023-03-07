// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class EncryptionError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.EncryptionError;
  public readonly name: string = 'EncryptionError';
}
