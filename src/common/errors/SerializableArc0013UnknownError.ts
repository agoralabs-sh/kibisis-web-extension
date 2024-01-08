// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

export default class SerializableArc0013UnknownError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.UnknownError;
  public readonly name: string = 'UnknownError';
}
