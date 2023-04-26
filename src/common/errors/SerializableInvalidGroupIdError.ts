import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// Errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableInvalidGroupIdError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidGroupIdError;
  public readonly name: string = 'InvalidGroupIdError';

  constructor(computedGroupId: string, message?: string) {
    super(
      message ||
        `computed group id "${computedGroupId}" does not match the assigned id of one or more transactions`
    );
  }
}
