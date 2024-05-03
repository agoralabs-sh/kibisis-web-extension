// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ScreenCaptureNotFoundError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.ScreenCaptureNotFoundError;
  public readonly name: string = 'ScreenCaptureNotFoundError';
}
