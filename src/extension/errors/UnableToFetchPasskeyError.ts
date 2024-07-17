// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class UnableToFetchPasskeyError extends BaseExtensionError {
  public readonly code = ErrorCodeEnum.UnableToFetchPasskeyError;
  public readonly id: string;
  public readonly name = 'UnableToFetchPasskeyError';

  constructor(id: string, message?: string) {
    super(message || `unable to fetch passkey "${id}"`);

    this.id = id;
  }
}
