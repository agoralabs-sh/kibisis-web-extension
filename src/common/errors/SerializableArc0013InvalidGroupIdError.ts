// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  computedGroupId: string;
}

export default class SerializableArc0013InvalidGroupIdError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.InvalidGroupIdError;
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
