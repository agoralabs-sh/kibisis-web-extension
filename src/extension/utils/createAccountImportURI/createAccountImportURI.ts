import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';

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
import type { IOptions } from './types';

/**
 * Convenience function that creates an account import URI scheme used by ARC-0300 to import an account.
 * @param {IOptions} options - various properties needed to create an account import URI scheme.
 * @returns {string} a URI scheme to be used to import the account.
 */
export default function createAccountImportURI({
  assets,
  encoding = ARC0300EncodingEnum.Hexadecimal,
  privateKey,
}: IOptions): string {
  let encodedPrivateKey: string;

  switch (encoding) {
    case ARC0300EncodingEnum.Base64URLSafe:
      encodedPrivateKey = encodeBase64URLSafe(privateKey);
      break;
    case ARC0300EncodingEnum.Hexadecimal:
    default:
      encodedPrivateKey = encodeHex(privateKey);
      break;
  }

  return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
    ARC0300PathEnum.Import
  }?${ARC0300QueryEnum.Encoding}=${encoding}&${
    ARC0300QueryEnum.PrivateKey
  }=${encodedPrivateKey.toLowerCase()}${
    assets && assets.length > 0
      ? `&${ARC0300QueryEnum.Asset}=${assets.join(',')}`
      : ''
  }`;
}
