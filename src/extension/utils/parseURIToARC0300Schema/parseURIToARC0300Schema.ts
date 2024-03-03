// constants
import { ARC_0026_SCHEME, ARC_0300_SCHEME } from '@extension/constants';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type { IARC0300BaseSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import parseARC0300AccountImportSchema from './parseARC0300AccountImportSchema';
import parseARC0300AssetAddSchema from './parseARC0300AssetAddSchema';

/**
 * Parses an ARC-0300 URI to a schema object.
 * @param {string} uri - the URI to parse.
 * @param {IBaseOptions} options - options needed to parse the URI.
 * @returns {IARC0300BaseSchema | null} a valid ARC-0300 schema, or null if the URI was invalid.
 */
export default function parseURIToARC0300Schema<Schema = IARC0300BaseSchema>(
  uri: string,
  { logger, supportedNetworks }: IOptions
): Schema | null {
  const _functionName: string = 'parseURIToARC0300Schema';
  const [scheme, authorityPathsAndQuery]: string[] = uri
    .split(':')
    .filter((value) => value);

  if (!scheme) {
    logger?.debug(`${_functionName}: invalid uri`);

    return null;
  }

  // check if we are using the correct scheme
  if (scheme !== ARC_0300_SCHEME && scheme !== ARC_0026_SCHEME) {
    logger?.debug(
      `${_functionName}: not an arc0300 or arc0026 scheme, found "${scheme}"`
    );

    return null;
  }

  const [authorityAndPaths, query] = authorityPathsAndQuery
    .split('?')
    .filter((value) => value);
  const [authority, ...paths] = authorityAndPaths
    .split('/')
    .filter((value) => value);

  // using the host of the parsed uri, determine the arc0300 method
  switch (authority) {
    case ARC0300AuthorityEnum.Account:
      // if we are importing an account
      if (paths[0] === ARC0300PathEnum.Import) {
        return parseARC0300AccountImportSchema(
          scheme,
          paths,
          new URLSearchParams(query),
          { logger }
        ) as Schema;
      }

      break;
    case ARC0300AuthorityEnum.Asset:
      if (paths[0] === ARC0300PathEnum.Add) {
        return parseARC0300AssetAddSchema(
          scheme,
          paths,
          new URLSearchParams(query),
          { logger, supportedNetworks }
        ) as Schema;
      }

      break;
    default:
      break;
  }

  return null;
}
