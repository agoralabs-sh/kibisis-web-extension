import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { Account } from 'algosdk';

// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300EncodingEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

/**
 * Convenience function that simple converts an account to the URI scheme used by ARC-0300 to import an account.
 * @param {Account} account - the algosdk account object.
 * @param {ARC0300EncodingEnum} encoding - [optional] the encoding to use. Defaults to hexadecimal.
 * @param {string[]} assets - [optional] any assets to also add to the app.
 * @returns {string} a URI scheme to be used to import the account.
 */
export default function convertAccountToAccountImportURI(
  account: Account,
  encoding: ARC0300EncodingEnum = ARC0300EncodingEnum.Hexadecimal,
  assets: string[]
): string {
  let encodedPrivateKey: string;

  switch (encoding) {
    case ARC0300EncodingEnum.Base64URLSafe:
      encodedPrivateKey = encodeBase64URLSafe(account.sk);
      break;
    case ARC0300EncodingEnum.Hexadecimal:
    default:
      encodedPrivateKey = encodeHex(account.sk);
      break;
  }

  return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
    ARC0300PathEnum.Import
  }?${ARC0300QueryEnum.Encoding}=${encoding}&${
    ARC0300QueryEnum.PrivateKey
  }=${encodedPrivateKey}${
    assets && assets.length > 0
      ? `&${ARC0300QueryEnum.Asset}=${assets.join(',')}`
      : ''
  }`;
}
