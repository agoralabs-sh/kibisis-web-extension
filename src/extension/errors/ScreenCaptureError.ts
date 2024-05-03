// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ScreenCaptureError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.ScreenCaptureError;
  public readonly domExceptionType: string;
  public readonly name: string = 'ScreenCaptureError';

  constructor(domExceptionType: string, message: string) {
    super(message);

    this.domExceptionType = domExceptionType;
  }
}
