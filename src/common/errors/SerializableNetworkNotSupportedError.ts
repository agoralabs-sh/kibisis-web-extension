import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// Errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableNetworkNotSupportedError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.NetworkNotSupportedError;
  public readonly genesisHash: string;
  public readonly name: string = 'NetworkNotSupportedError';

  constructor(genesisHash: string, message?: string) {
    super(
      message ||
        `wallet does not support network with genesis hash "${genesisHash}"`
    );

    this.genesisHash = genesisHash;
  }
}
