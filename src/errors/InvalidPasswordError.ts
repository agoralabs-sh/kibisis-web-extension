// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class InvalidPasswordError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidPasswordError;
  public readonly name: string = 'InvalidPasswordError';

  constructor() {
    super('invalid password');
  }
}
