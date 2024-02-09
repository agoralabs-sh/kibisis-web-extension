// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ARC0200NotAValidApplicationError extends BaseExtensionError {
  public readonly appId: string;
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.ARC0200NotAValidApplication;
  public readonly name: string = 'ARC0200NotAValidApplicationError';

  constructor(appId: string) {
    super(`application "${appId}" is not a valid arc-0200 application`);

    this.appId = appId;
  }
}
