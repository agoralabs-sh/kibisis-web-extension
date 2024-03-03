import {
  decodeURLSafe as decodeBase63URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';

// enums
import {
  ARC0300AssetTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IARC0300AssetAddSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import isNumericString from '@extension/utils/isNumericString';

export default function parseARC0300AssetAddSchema(
  scheme: string,
  paths: string[],
  searchParams: URLSearchParams,
  { logger, supportedNetworks }: IOptions
): IARC0300AssetAddSchema | null {
  const _functionName: string = 'parseARC0300AssetAddSchema';
  let genesisHash: string;
  let genesisHashParam: string | null;
  let type: ARC0300AssetTypeEnum;
  let typeParam: string | null;

  if (paths[0] !== ARC0300PathEnum.Add) {
    logger?.debug(`${_functionName}: invalid asset add uri`);

    return null;
  }

  if (!paths[1] || !isNumericString(paths[1])) {
    logger?.debug(`${_functionName}: unable to get asset id`);

    return null;
  }

  genesisHashParam = searchParams.get(ARC0300QueryEnum.GenesisHash);

  if (!genesisHashParam) {
    logger?.debug(`${_functionName}: no genesis hash param found`);

    return null;
  }

  // convert from base 64 url safe to standard base64
  genesisHash = encodeBase64(decodeBase63URLSafe(genesisHashParam));

  if (!supportedNetworks.find((value) => value.genesisHash === genesisHash)) {
    logger?.debug(
      `${_functionName}: network with genesis hash "${genesisHash}" not supported`
    );

    return null;
  }

  typeParam = searchParams.get(ARC0300QueryEnum.Type);

  if (!typeParam) {
    logger?.debug(`${_functionName}: no type param found`);

    return null;
  }

  switch (typeParam) {
    case ARC0300AssetTypeEnum.ARC0200:
      type = ARC0300AssetTypeEnum.ARC0200;
      break;
    default:
      logger?.debug(
        `${_functionName}: unknown type param "${typeParam}" for method "${ARC0300PathEnum.Add}"`
      );

      return null;
  }

  return {
    authority: ARC0300AuthorityEnum.Asset,
    paths: [ARC0300PathEnum.Add, paths[1]],
    query: {
      [ARC0300QueryEnum.GenesisHash]: genesisHash,
      [ARC0300QueryEnum.Type]: type,
    },
    scheme,
  };
}
