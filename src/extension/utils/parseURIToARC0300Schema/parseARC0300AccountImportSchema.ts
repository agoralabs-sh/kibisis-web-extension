// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IBaseOptions } from '@common/types';
import type { IARC0300AccountImportSchema } from '@extension/types';

export default function parseARC0300AccountImportSchema(
  scheme: string,
  paths: string[],
  searchParams: URLSearchParams,
  options?: IBaseOptions
): IARC0300AccountImportSchema | null {
  const _functionName = 'parseARC0300AccountImportSchema';
  const logger = options?.logger;
  let checksumParam: string | null;
  let nameParams: string[];
  let pagination: number[] = [];
  let pageParam: string | null;
  let privateKeyParams: string[];

  if (paths[0] !== ARC0300PathEnum.Import) {
    logger?.debug(
      `${_functionName}: invalid account import uri, no /import path found`
    );

    return null;
  }

  checksumParam = searchParams.get(ARC0300QueryEnum.Checksum);
  nameParams = searchParams.getAll(ARC0300QueryEnum.Name);
  pageParam = searchParams.get(ARC0300QueryEnum.Page);
  privateKeyParams = searchParams.getAll(ARC0300QueryEnum.PrivateKey);

  if (privateKeyParams.length <= 0) {
    logger?.debug(
      `${_functionName}: invalid account import uri, no private keys found`
    );

    return null;
  }

  if (pageParam) {
    pagination = pageParam.split(':').map((value) => parseInt(value));
  }

  return {
    authority: ARC0300AuthorityEnum.Account,
    paths: [ARC0300PathEnum.Import],
    query: {
      [ARC0300QueryEnum.Name]: nameParams,
      [ARC0300QueryEnum.PrivateKey]: privateKeyParams,
      ...(checksumParam && {
        [ARC0300QueryEnum.Checksum]: checksumParam,
      }),
      ...(pageParam && {
        [ARC0300QueryEnum.Page]: {
          page: pagination[0],
          total: pagination[1],
        },
      }),
    },
    scheme,
  };
}
