// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class OfflineError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.OfflineError;
  public readonly name: string = 'OfflineError';
}
