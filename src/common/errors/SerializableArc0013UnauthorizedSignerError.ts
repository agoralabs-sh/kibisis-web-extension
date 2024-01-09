// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  signer: string;
}

export default class SerializableArc0013UnauthorizedSignerError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.UnauthorizedSignerError;
  public readonly data: IData;
  public readonly name: string = 'UnauthorizedSignerError';

  constructor(signer: string, providerId: string, message?: string) {
    super(message || `unauthorized signer "${signer}"`, providerId);

    this.data = {
      signer,
    };
  }
}
