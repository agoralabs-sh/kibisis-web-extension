import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import SparkMD5 from 'spark-md5';
import { randomBytes } from 'tweetnacl';

// constants
import {
  ARC_0300_SCHEME,
  EXPORT_ACCOUNT_PAGE_LIMIT,
} from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IExportAccount, IOptions } from './types';

/**
 * Convenience function that creates paginated account import URIs schemes used by ARC-0300 to import an accounts.
 * @param {IOptions} options - various properties needed to create an account import URI scheme.
 * @returns {string[]} a set or URI schemes that can be used to import accounts.
 */
export default function createAccountImportURIs({
  accounts,
}: IOptions): string[] {
  const totalPages: number = Math.ceil(
    accounts.length / EXPORT_ACCOUNT_PAGE_LIMIT
  );
  const namedAccounts = accounts.filter(({ name }) => !!name);
  const unnamedAccounts = accounts.filter(({ name }) => !name);
  const sortedAccounts = [
    ...namedAccounts, // put the named accounts first as index matters
    ...unnamedAccounts,
  ];
  let accountsSlice: IExportAccount[];
  let checksum: string;
  let queryParams: URLSearchParams;
  let start: number;

  // no need to paginate when the account limit has not been exceeded; when there is only one page
  if (totalPages <= 1) {
    queryParams = new URLSearchParams();

    sortedAccounts.forEach(({ name, privateKey }) => {
      name && queryParams.append(ARC0300QueryEnum.Name, name);
      queryParams.append(
        ARC0300QueryEnum.PrivateKey,
        encodeBase64URLSafe(privateKey)
      );
    });

    return [
      `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
        ARC0300PathEnum.Import
      }?${queryParams.toString()}`,
    ];
  }

  // create a md5 checksum
  checksum = SparkMD5.ArrayBuffer.hash(randomBytes(32));

  return Array.from<void, string>({ length: totalPages }, (_, index) => {
    start = EXPORT_ACCOUNT_PAGE_LIMIT * index;
    accountsSlice = sortedAccounts.slice(
      start,
      start + EXPORT_ACCOUNT_PAGE_LIMIT
    );
    queryParams = new URLSearchParams();

    accountsSlice.forEach(({ name, privateKey }) => {
      name && queryParams.append(ARC0300QueryEnum.Name, name);
      queryParams.append(
        ARC0300QueryEnum.PrivateKey,
        encodeBase64URLSafe(privateKey)
      );
    });

    // add the checksum and the page information
    queryParams.append(ARC0300QueryEnum.Checksum, checksum);
    queryParams.append(
      ARC0300QueryEnum.Page,
      `${String(index)}:${String(totalPages)}`
    );

    return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${queryParams.toString()}`;
  });
}
