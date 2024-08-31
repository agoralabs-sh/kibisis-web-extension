// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class LedgerNotSupportedError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.LedgerNotSupportedError;
  public readonly name = 'LedgerNotSupportedError';
}
