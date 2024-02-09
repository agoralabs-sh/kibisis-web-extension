// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ARC0200NotAValidMethodError extends BaseExtensionError {
  public readonly appId: string;
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.ARC0200NotAValidMethod;
  public readonly method: string;
  public readonly name: string = 'ARC0200NotAValidMethodError';

  constructor(appId: string, method: string) {
    super(`application "${appId}" does not contain a "${method}" method`);

    this.appId = appId;
    this.method = method;
  }
}
