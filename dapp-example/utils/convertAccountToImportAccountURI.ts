import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { Account } from 'algosdk';

// enums
import { Arc0300ImportKeyEncodingEnum } from '@extension/enums';

/**
 * Convenience function that simple converts an account to the URI scheme used by ARC-0300 to import an account.
 * @param {Account} account - the algosdk account object.
 * @param {Arc0300ImportKeyEncodingEnum} encoding - [optional] the encoding to use. Defaults to hexadecimal.
 * @returns {string} a URI scheme to be used to import the account.
 */
export default function convertAccountToImportAccountURI(
  account: Account,
  encoding: Arc0300ImportKeyEncodingEnum = Arc0300ImportKeyEncodingEnum.Hexadecimal
): string {
  let encodedPrivateKey: string;

  switch (encoding) {
    case Arc0300ImportKeyEncodingEnum.Base64URLSafe:
      encodedPrivateKey = encodeBase64URLSafe(account.sk);
      break;
    case Arc0300ImportKeyEncodingEnum.Hexadecimal:
    default:
      encodedPrivateKey = encodeHex(account.sk);
      break;
  }

  return `algorand://importkey/${encodedPrivateKey}?encoding=${encoding}`;
}
