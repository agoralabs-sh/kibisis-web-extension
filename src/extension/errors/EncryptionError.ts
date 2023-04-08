// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseExtensionError from './BaseExtensionError';

export default class EncryptionError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.EncryptionError;
  public readonly name: string = 'EncryptionError';
}
