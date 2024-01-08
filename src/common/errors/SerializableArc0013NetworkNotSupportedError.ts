// enums
import { Arc0013ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0013Error from './BaseSerializableArc0013Error';

interface IData {
  genesisHash: string;
}

export default class SerializableArc0013NetworkNotSupportedError extends BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum =
    Arc0013ErrorCodeEnum.NetworkNotSupportedError;
  public readonly data: IData;
  public readonly name: string = 'NetworkNotSupportedError';

  constructor(genesisHash: string, providerId: string, message?: string) {
    super(
      message ||
        `provider does not support network with genesis hash "${genesisHash}"`,
      providerId
    );

    this.data = {
      genesisHash,
    };
  }
}
