// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class MalformedDataError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.MalformedDataError;
  public readonly name: string = 'MalformedDataError';
}
