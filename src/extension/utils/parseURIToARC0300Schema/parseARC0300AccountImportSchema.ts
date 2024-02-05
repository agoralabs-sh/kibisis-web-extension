// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300EncodingEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IARC0300AccountImportSchema } from '@extension/types';

export default function parseARC0300AccountImportSchema(
  paths: string[],
  searchParams: URLSearchParams,
  options?: IBaseOptions
): IARC0300AccountImportSchema | null {
  const _functionName: string = 'parseARC0300AccountImportSchema';
  const logger: ILogger | undefined = options?.logger;
  let privateKeyParam: string | null;
  let encodingParam: string | null;
  let encoding: ARC0300EncodingEnum;

  if (paths[0] !== ARC0300PathEnum.Import) {
    logger?.debug(`${_functionName}: invalid account import uri`);

    return null;
  }

  privateKeyParam = searchParams.get(ARC0300QueryEnum.PrivateKey);

  if (!privateKeyParam) {
    logger?.debug(`${_functionName}: no private key param found`);

    return null;
  }

  encodingParam = searchParams.get(ARC0300QueryEnum.Encoding);

  if (!encodingParam) {
    logger?.debug(`${_functionName}: no encoding param found`);

    return null;
  }

  switch (encodingParam) {
    case ARC0300EncodingEnum.Base64URLSafe:
      encoding = ARC0300EncodingEnum.Base64URLSafe;
      break;
    case ARC0300EncodingEnum.Hexadecimal:
      encoding = ARC0300EncodingEnum.Hexadecimal;
      break;
    default:
      logger?.debug(
        `${_functionName}: unknown encoding param "${encodingParam}" for method "${ARC0300PathEnum.Import}"`
      );

      return null;
  }

  return {
    authority: ARC0300AuthorityEnum.Account,
    paths: [ARC0300PathEnum.Import],
    query: {
      encoding,
      privateKey: privateKeyParam,
    },
    scheme: ARC_0300_SCHEME,
  };
}
