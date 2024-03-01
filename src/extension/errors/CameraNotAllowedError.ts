// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class CameraNotAllowedError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.CameraNotAllowedError;
  public readonly name: string = 'CameraNotAllowedError';
}
