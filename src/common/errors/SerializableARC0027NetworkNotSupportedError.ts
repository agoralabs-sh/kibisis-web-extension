// enums
import { ARC0027ErrorCodeEnum } from '@common/enums';

// errors
import BaseSerializableARC0027Error from './BaseSerializableARC0027Error';

interface IData {
  genesisHash: string;
}

export default class SerializableARC0027NetworkNotSupportedError extends BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum =
    ARC0027ErrorCodeEnum.NetworkNotSupportedError;
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
