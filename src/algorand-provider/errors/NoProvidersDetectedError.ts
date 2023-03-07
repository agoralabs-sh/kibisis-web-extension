// Enums
import { ErrorCodeEnum } from '../enums';

// Errors
import BaseError from './BaseError';

export default class NoProvidersDetectedError extends BaseError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.NoProvidersDetectedError;
  public readonly name: string = 'NoProvidersDetectedError';
}
