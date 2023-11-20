// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class InvalidPasswordError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidPasswordError;
  public readonly name: string = 'InvalidPasswordError';

  constructor() {
    super('invalid password');
  }
}
