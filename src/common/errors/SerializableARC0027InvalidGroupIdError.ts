// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

export default class SerializableARC0027InvalidGroupIdError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.InvalidGroupIdError;
  public readonly name: string = 'InvalidGroupIdError';

  constructor(providerId: string, message?: string) {
    super(
      message ||
        `computed group id does not match the assigned id of one or more transactions`,
      providerId
    );
  }
}
