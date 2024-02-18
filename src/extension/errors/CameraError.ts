// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class CameraError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.CameraError;
  public readonly domExceptionType: string;
  public readonly name: string = 'CameraError';

  constructor(domExceptionType: string, message: string) {
    super(message);

    this.domExceptionType = domExceptionType;
  }
}
