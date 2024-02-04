import { decodeURLSafe as decodeBase64URLSafe } from '@stablelib/base64';
import { decode as decodeHex } from '@stablelib/hex';

// enums
import { Arc0300EncodingEnum } from '@extension/enums';

// types
import type { IArc0300ImportKeySchema } from '@extension/types';

export default function decodePrivateKeyFromImportKeySchema(
  schema: IArc0300ImportKeySchema
): Uint8Array | null {
  let privateKey: Uint8Array | null = null;

  switch (schema.encoding) {
    case Arc0300EncodingEnum.Base64URLSafe:
      privateKey = decodeBase64URLSafe(schema.encodedPrivateKey);

      break;
    case Arc0300EncodingEnum.Hexadecimal:
      privateKey = decodeHex(schema.encodedPrivateKey);

      break;
    default:
      break;
  }

  return privateKey;
}
