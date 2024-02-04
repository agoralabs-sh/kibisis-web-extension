// constants
import { ARC_0300_PROTOCOL } from '@extension/constants';

// enums
import { Arc0300EncodingEnum, Arc0300MethodEnum } from '@extension/enums';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IArc0300ImportKeySchema } from '@extension/types';

export default function parseArc0300ImportKeySchema(
  pathname: string,
  searchParams: URLSearchParams,
  options?: IBaseOptions
): IArc0300ImportKeySchema | null {
  const _functionName: string = 'parseArc0300ImportKeySchema';
  const logger: ILogger | undefined = options?.logger;
  const paths: string[] = pathname.split('/').filter((value) => value);
  let encodingParam: string | null;
  let encoding: Arc0300EncodingEnum;

  if (paths.length <= 0) {
    logger?.debug(
      `${_functionName}: no private key found for method "${Arc0300MethodEnum.ImportKey}"`
    );

    return null;
  }

  encodingParam = searchParams.get('encoding');

  if (!encodingParam) {
    logger?.debug(
      `${_functionName}: no encoding param found for method "${Arc0300MethodEnum.ImportKey}"`
    );

    return null;
  }

  switch (encodingParam) {
    case Arc0300EncodingEnum.Base64URLSafe:
      encoding = Arc0300EncodingEnum.Base64URLSafe;
      break;
    case Arc0300EncodingEnum.Hexadecimal:
      encoding = Arc0300EncodingEnum.Hexadecimal;
      break;
    default:
      logger?.debug(
        `${_functionName}: unknown encoding param "${encodingParam}" for method "${Arc0300MethodEnum.ImportKey}"`
      );

      return null;
  }

  return {
    encoding,
    method: Arc0300MethodEnum.ImportKey,
    encodedPrivateKey: paths[0],
    protocol: ARC_0300_PROTOCOL,
  };
}
