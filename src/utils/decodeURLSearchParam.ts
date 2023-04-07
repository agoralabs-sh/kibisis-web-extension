/**
 * Convenience function ta simply get the url search param and decode. If no search param exists, null is returned.
 * @param {string} key - the name of the search param to decode.
 * @param {URLSearchParams} searchParams - the search params.
 * @returns {string | null} the decoded search param or null.
 */
export default function decodeURLSearchParam(
  key: string,
  searchParams: URLSearchParams
): string | null {
  const searchParam: string | null = searchParams.get(key);

  if (!searchParam) {
    return null;
  }

  return decodeURIComponent(searchParam);
}
