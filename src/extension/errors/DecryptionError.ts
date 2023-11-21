// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class DecryptionError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.DecryptionError;
  public readonly name: string = 'DecryptionError';
}
