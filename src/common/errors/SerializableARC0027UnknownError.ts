// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

export default class SerializableARC0027UnknownError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
