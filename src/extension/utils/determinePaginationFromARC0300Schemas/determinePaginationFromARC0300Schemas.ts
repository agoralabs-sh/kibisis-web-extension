// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type {
  IARC0300BaseSchema,
  IARC0300PaginationQueryItem,
} from '@extension/types';

/**
 * Convenience function that determines the pagination of a set of schemas. This function uses the first schema as a
 * reference point for the set of pages.
 * @param {(IARC0300BaseSchema | null)[]} schemas - the list of schemas to check.
 * @returns {[number, number]} an array of two elements where the first element is the pages available and the second
 * element is the total number of pages, or null if the first schema is not paginated.
 */
export default function determinePaginationFromARC0300Schemas(
  schemas: (IARC0300BaseSchema | null)[]
): [number, number] | null {
  let checksum: string | null;
  let page: number | undefined;
  let pages: number[] = [];
  let pageTotal: number | undefined;

  // if there is only one element, or there is no pagination, it is invalid (null)
  if (schemas.length <= 1 && !schemas[0]?.query[ARC0300QueryEnum.Page]) {
    return null;
  }

  checksum = (schemas[0]?.query[ARC0300QueryEnum.Checksum] as string) || null;
  pageTotal = (
    schemas[0]?.query[ARC0300QueryEnum.Page] as IARC0300PaginationQueryItem
  )?.total;

  if (!checksum || !pageTotal) {
    return null;
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

  // if the page count is higher than the page total, something is wrong
  if (pages.length > pageTotal) {
    return null;
  }

  return [pages.length, pageTotal];
}
