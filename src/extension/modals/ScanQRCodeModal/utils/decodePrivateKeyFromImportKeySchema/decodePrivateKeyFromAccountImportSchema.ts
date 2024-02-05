import { decodeURLSafe as decodeBase64URLSafe } from '@stablelib/base64';
import { decode as decodeHex } from '@stablelib/hex';

// enums
import { ARC0300EncodingEnum, ARC0300QueryEnum } from '@extension/enums';

// types
import type { IARC0300AccountImportSchema } from '@extension/types';

export default function decodePrivateKeyFromAccountImportSchema(
  schema: IARC0300AccountImportSchema
): Uint8Array | null {
  let privateKey: Uint8Array | null = null;

  switch (schema.query[ARC0300QueryEnum.Encoding]) {
    case ARC0300EncodingEnum.Base64URLSafe:
      privateKey = decodeBase64URLSafe(
        schema.query[ARC0300QueryEnum.PrivateKey]
      );

      break;
    case ARC0300EncodingEnum.Hexadecimal:
      privateKey = decodeHex(schema.query[ARC0300QueryEnum.PrivateKey]);

      break;
    default:
      break;
  }

  return privateKey;
}
