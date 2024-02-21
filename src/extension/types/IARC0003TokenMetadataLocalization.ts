/**
 * @property {string} default - The locale of the default data within the base JSON.
 * @property {string} locales - The list of locales for which data is available. These locales should conform to those defined in the Unicode Common Locale Data Repository (http://cldr.unicode.org/).
 * @property {Record<string, string>} integrity - [optional] The SHA-256 digests of the localized JSON files (except the default one). The field name is the locale. The field value is a single SHA-256 integrity metadata as defined in the W3C subresource integrity specification (https://w3c.github.io/webappsec-subresource-integrity).
 * @property {string} uri - The URI pattern to fetch localized data from. This URI should contain the substring `{locale}` which will be replaced with the appropriate locale value before sending the request.
 */
interface IARC0003TokenMetadataLocalization {
  default: string;
  locales: string[];
  integrity?: Record<string, string>;
  uri: string;
}

export default IARC0003TokenMetadataLocalization;
