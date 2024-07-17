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

// utils
import isNumericString from '@extension/utils/isNumericString';

export default function parseARC0300AccountImportSchema(
  scheme: string,
  paths: string[],
  searchParams: URLSearchParams,
  options?: IBaseOptions
): IARC0300AccountImportSchema | null {
  const _functionName = 'parseARC0300AccountImportSchema';
  const logger = options?.logger;
  let addressParam: string | null;
  let assets: string[] = [];
  let assetParam: string | null;
  let encoding: ARC0300EncodingEnum;
  let encodingParam: string | null;
  let privateKeyParam: string | null;

  if (paths[0] !== ARC0300PathEnum.Import) {
    logger?.debug(`${_functionName}: invalid account import uri`);

    return null;
  }

  assetParam = searchParams.get(ARC0300QueryEnum.Asset);

  // if we have an asset param, get the list of assets
  if (assetParam) {
    assets = assetParam.split(',').filter((value) => isNumericString(value));
  }

  privateKeyParam = searchParams.get(ARC0300QueryEnum.PrivateKey);

  if (!privateKeyParam) {
    logger?.debug(
      `${_functionName}: no private key param found, attempting to parse watch account`
    );

    addressParam = searchParams.get(ARC0300QueryEnum.Address);

    if (!addressParam) {
      logger?.debug(
        `${_functionName}: no address param found and no private key param found`
      );

      return null;
    }

    return {
      authority: ARC0300AuthorityEnum.Account,
      paths: [ARC0300PathEnum.Import],
      query: {
        [ARC0300QueryEnum.Address]: addressParam,
        [ARC0300QueryEnum.Asset]: assets,
      },
      scheme,
    };
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
      [ARC0300QueryEnum.Asset]: assets,
      [ARC0300QueryEnum.Encoding]: encoding,
      [ARC0300QueryEnum.PrivateKey]: privateKeyParam,
    },
    scheme,
  };
}
