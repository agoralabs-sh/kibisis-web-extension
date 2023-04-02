/**
 * Convenience function that encodes a string or arbitrary bit of data to a base64 url string
 * @param {string | Uint8Array} input - the string or data to encode.
 * @returns {string} a base64 Url encoded string.
 * @throws {InvalidCharacterError} if the input contains characters that did not fit in a single byte.
 */
export default function encodeBase64Url(input: string | Uint8Array): string {
  const parseToBase64Url: (base64String: string) => string = (
    base64String: string
  ) => base64String.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  let decoder: TextDecoder;
  let decodedString: string;

  if (typeof input === 'string') {
    return parseToBase64Url(window.btoa(input));
  }

  decoder = new TextDecoder();
  decodedString = decoder.decode(input);

  return parseToBase64Url(window.btoa(decodedString));
}
