// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class PasskeyCreationError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.PasskeyCreationError;
  public readonly name = 'PasskeyCreationError';
}
