// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ScreenCaptureNotAllowedError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.ScreenCaptureNotAllowedError;
  public readonly name: string = 'ScreenCaptureNotAllowedError';
}
