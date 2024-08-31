// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class LedgerNotConnectedError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.LedgerNotConnectedError;
  public readonly name = 'LedgerNotConnectedError';
}
