// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type {
  IARC0300BaseSchema,
  IARC0300PaginationQueryItem,
} from '@extension/types';

/**
 * Convenience function that checks a list of schemas to see if all the pages are present. This function uses the first
 * schema as the reference point, if the first schema is not paginated, it returns true. If the checksums mismatch or
 * all the pages are not present, false is returned.
 * @param {(IARC0300BaseSchema | null)[]} schemas - the list of schemas to check.
 * @returns {boolean} true if all the pages are present & checksums match or the only element is a non paginated schema.
 * Otherwise, false is returned.
 */
export default function isARC0300SchemaPaginationComplete(
  schemas: (IARC0300BaseSchema | null)[]
): boolean {
  let checksum: string | null;
  let page: number | undefined;
  let pages: number[] = [];
  let pageTotal: number | undefined;

  // if there is only one element, and it is not paginated, we have a complete set
  if (schemas.length <= 1 && !schemas[0]?.query[ARC0300QueryEnum.Page]) {
    return true;
  }

  checksum = (schemas[0]?.query[ARC0300QueryEnum.Checksum] as string) || null;
  pageTotal = (
    schemas[0]?.query[ARC0300QueryEnum.Page] as IARC0300PaginationQueryItem
  )?.total;

  if (!checksum || !pageTotal) {
    return false;
  }

  schemas.forEach((schema) => {
    page = (
      schema?.query[ARC0300QueryEnum.Page] as
        | IARC0300PaginationQueryItem
        | undefined
    )?.page;

    if (
      typeof page === 'number' &&
      schema?.query[ARC0300QueryEnum.Checksum] === checksum &&
      !pages.some((value) => value === page)
    ) {
      pages.push(page);
    }
  });

  return pages.length === pageTotal;
}
