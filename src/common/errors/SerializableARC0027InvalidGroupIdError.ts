// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

interface IData {
  computedGroupId: string;
}

export default class SerializableARC0027InvalidGroupIdError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.InvalidGroupIdError;
  public readonly data: IData;
  public readonly name: string = 'InvalidGroupIdError';

  constructor(computedGroupId: string, providerId: string, message?: string) {
    super(
      message ||
        `computed group id "${computedGroupId}" does not match the assigned id of one or more transactions`,
      providerId
    );

    this.data = {
      computedGroupId,
    };
  }
}
