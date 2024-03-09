// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class DecodingError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.DecodingError;
  public readonly name: string = 'DecodingError';
}
