// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IOptions } from './types';

/**
 * Convenience function that creates a watch account import URI scheme used by ARC-0300 to import an account.
 * @param {IOptions} options - various properties needed to create an account import URI scheme.
 * @returns {string} a URI scheme to be used to import the watch account.
 */
export default function createWatchAccountImportURI({
  address,
  assets,
}: IOptions): string {
  return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
    ARC0300PathEnum.Import
  }?${ARC0300QueryEnum.Address}=${address}${
    assets && assets.length > 0
      ? `&${ARC0300QueryEnum.Asset}=${assets.join(',')}`
      : ''
  }`;
}
