// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class UnknownError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
