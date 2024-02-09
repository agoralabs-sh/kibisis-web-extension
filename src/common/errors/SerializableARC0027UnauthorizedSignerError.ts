// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

interface IData {
  signer: string | null;
}

export default class SerializableARC0027UnauthorizedSignerError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.UnauthorizedSignerError;
  public readonly data: IData;
  public readonly name: string = 'UnauthorizedSignerError';

  constructor(signer: string | null, providerId: string, message?: string) {
    super(message || `unauthorized signer "${signer}"`, providerId);

    this.data = {
      signer,
    };
  }
}
