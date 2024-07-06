// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class PasskeyNotSupportedError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.PasskeyNotSupportedError;
  public readonly name = 'PasskeyNotSupportedError';
}
