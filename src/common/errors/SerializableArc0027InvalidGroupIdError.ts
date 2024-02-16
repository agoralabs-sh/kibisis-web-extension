// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

export default class SerializableArc0027InvalidGroupIdError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.InvalidGroupIdError;
  public readonly name: string = 'InvalidGroupIdError';

  constructor(providerId: string, message?: string) {
    super(
      message ||
        `computed group id does not match the assigned id of one or more transactions`,
      providerId
    );
  }
}
