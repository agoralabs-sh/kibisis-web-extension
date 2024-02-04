// constants
import { ARC_0300_PROTOCOL } from '@extension/constants';

// enums
import { Arc0300MethodEnum } from '@extension/enums';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IArc0300BaseSchema } from '@extension/types';

// utils
import parseArc0300ImportKeySchema from './parseArc0300ImportKeySchema';

/**
 * Parses an ARC-0300 URI to a schema object.
 * @param {string} uri - the URI to parse.
 * @param {IBaseOptions} options - [optional] base options to add utility to the function, such as logging.
 * @returns {IArc0300BaseSchema | null} a valid ARC-0300 schema, or null if the URI was invalid.
 */
export default function parseURIToArc0300Schema<Schema = IArc0300BaseSchema>(
  uri: string,
  options?: IBaseOptions
): Schema | null {
  const _functionName: string = 'parseURIToArc0300Schema';
  const logger: ILogger | undefined = options?.logger;
  let url: URL;

  // parse the url
  try {
    url = new URL(uri);
  } catch (error) {
    logger?.debug(`${_functionName}: invalid url`);

    return null;
  }

  // check if we are using the correct protocol
  if (url.protocol !== `${ARC_0300_PROTOCOL}:`) {
    logger?.debug(
      `${_functionName}: not an arc0300 protocol, found "${url.protocol}"`
    );

    return null;
  }

  // using the host of the parsed url, determine the arc0300 method
  switch (url.host) {
    case Arc0300MethodEnum.ImportKey:
      return parseArc0300ImportKeySchema(
        url.pathname,
        url.searchParams,
        options
      ) as Schema;
    default:
      break;
  }

  return null;
}
