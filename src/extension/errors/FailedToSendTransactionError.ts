// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class FailedToSendTransactionError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.FailedToSendTransactionError;
  public readonly name: string = 'FailedToSendTransactionError';
}
