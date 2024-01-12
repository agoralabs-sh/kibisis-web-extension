// enums
import { Arc0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableArc0027Error from './BaseSerializableArc0027Error';

interface IData {
  genesisHash: string;
}

export default class SerializableArc0027NetworkNotSupportedError extends BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum =
    Arc0027ErrorCodeEnum.NetworkNotSupportedError;
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
