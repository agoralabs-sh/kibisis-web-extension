// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ReadABIContractError extends BaseExtensionError {
  public readonly appId: string;
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.ReadABIContractError;
  public readonly name: string = 'ReadABIContractError';

  constructor(appId: string, message?: string) {
    super(message || `application "${appId}" failed read method`);

    this.appId = appId;
  }
}
