// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  computedGroupId: string;
}

export default class SerializableArc0027InvalidGroupIdError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.InvalidGroupIdError;
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
