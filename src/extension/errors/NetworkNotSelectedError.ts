// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class NetworkNotSelectedError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.NetworkNotSelectedError;
  public readonly name: string = 'NetworkNotSelectedError';
}
