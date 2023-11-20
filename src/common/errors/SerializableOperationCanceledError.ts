import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableOperationCanceledError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.OperationCanceledError;
  public readonly name: string = 'OperationCanceledError';
}
