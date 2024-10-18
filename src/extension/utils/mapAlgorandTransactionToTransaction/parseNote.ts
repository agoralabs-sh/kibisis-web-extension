import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUtf8 } from '@stablelib/utf8';

// types
import type { IBaseOptions } from '@common/types';

/**
 * Parses the note field. The note field will be encoded in base64 and this function will attempt to decode to UTF-8. If
 * the note field is not in UTF-8 format, it gracefully errors and returns null.
 * @param {string} encodedNote - The note field encoded in base64.
 * @param {IBaseOptions} options - [optional] Base options that include the logger for logging.
 * @returns {string | null} The decoded note field or null if UTF-8 decoding failed.
 */
export default function parseNote(
  encodedNote: string,
  options?: IBaseOptions
): string | null {
  const _functionName = 'parseNote';

  try {
    return decodeUtf8(
      decodeBase64(encodedNote) // decode from base64
    );
  } catch (error) {
    options?.logger?.debug(`${_functionName}: note not encoded in utf-8`);

    return null;
  }
}
