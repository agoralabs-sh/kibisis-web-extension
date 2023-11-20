import {
  BaseError,
  ErrorCodeEnum,
  NetworkNotSupportedError,
  OperationCanceledError,
  UnknownError,
} from '@agoralabs-sh/algorand-provider';

// errors
import {
  BaseSerializableError,
  SerializableNetworkNotSupportedError,
} from '@common/errors';

/**
 * Utility function that maps the serialized errors to @agoralabs-sh/algorand-provider errors.
 * @param {BaseSerializableError} error - the serialized error.
 * @returns {BaseError} the serialized error as an @agoralabs-sh/algorand-provider error.
 */
export default function mapSerializableErrors(
  error: BaseSerializableError
): BaseError {
  switch (error.code) {
    case ErrorCodeEnum.NetworkNotSupportedError:
      return new NetworkNotSupportedError(
        (error as SerializableNetworkNotSupportedError).genesisHash,
        error.message
      );
    case ErrorCodeEnum.OperationCanceledError:
      return new OperationCanceledError(error.message);
    default:
      return new UnknownError(error.message);
  }
}
