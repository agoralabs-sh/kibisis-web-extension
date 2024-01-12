// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

export default class SerializableArc0027UnknownError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
