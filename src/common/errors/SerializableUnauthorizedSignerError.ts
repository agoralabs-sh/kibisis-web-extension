import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

// errors
import BaseSerializableError from './BaseSerializableError';

export default class SerializableUnauthorizedSignerError extends BaseSerializableError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.UnauthorizedSignerError;
  public readonly name: string = 'UnauthorizedSigner';
  public readonly signer: string;

  constructor(signer: string, message?: string) {
    super(message || `signer "${signer}" not authorized`);

    this.signer = signer;
  }
}
