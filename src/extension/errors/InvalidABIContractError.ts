// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class InvalidABIContractError extends BaseExtensionError {
  public readonly appId: string;
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidABIContractError;
  public readonly name: string = 'InvalidABIContractError';

  constructor(appId: string, message?: string) {
    super(message || `application "${appId}" does not match the abi`);

    this.appId = appId;
  }
}
