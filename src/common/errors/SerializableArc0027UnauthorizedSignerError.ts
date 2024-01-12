// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  signer: string | null;
}

export default class SerializableArc0027UnauthorizedSignerError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.UnauthorizedSignerError;
  public readonly data: IData;
  public readonly name: string = 'UnauthorizedSignerError';

  constructor(signer: string | null, providerId: string, message?: string) {
    super(message || `unauthorized signer "${signer}"`, providerId);

    this.data = {
      signer,
    };
  }
}
