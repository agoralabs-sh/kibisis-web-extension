// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class LedgerFetchError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.LedgerFetchError;
  public readonly name = 'LedgerFetchError';
}
