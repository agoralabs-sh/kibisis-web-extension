// types
import type IARC0003TokenMetadataLocalization from './IARC0003TokenMetadataLocalization';

/**
 * @property {string} animation_url - [optional] A URI pointing to a multi-media file representing the asset.
 * @property {string} animation_url_integrity - [optional] The SHA-256 digest of the file pointed by the URI external_url. The field value is a single SHA-256 integrity metadata as defined in the W3C subresource integrity specification (https://w3c.github.io/webappsec-subresource-integrity).
 * @property {string} animation_url_mimetype - [optional] The MIME type of the file pointed by the URI animation_url. If the MIME type is not specified, clients MAY guess the MIME type from the file extension or MAY decide not to display the asset at all. It is STRONGLY RECOMMENDED to include the MIME type.
 * @property {string} background_color - [optional] Background color do display the asset. MUST be a six-character hexadecimal without a pre-pended #.
 * @property {number} decimals - [optional] The number of decimal places that the token amount should display - e.g. 18, means to divide the token amount by 1000000000000000000 to get its user representation.
 * @property {string} description - [optional] Describes the asset to which this token represents.
 * @property {string} external_url - [optional] A URI pointing to an external website presenting the asset.
 * @property {string} external_url_integrity - [optional] The SHA-256 digest of the file pointed by the URI external_url. The field value is a single SHA-256 integrity metadata as defined in the W3C subresource integrity specification (https://w3c.github.io/webappsec-subresource-integrity).
 * @property {string} external_url_mimetype - [optional] The MIME type of the file pointed by the URI external_url. It is expected to be 'text/html' in almost all cases.
 * @property {string} extra_metadata - [optional] Extra metadata in base64. If the field is specified (even if it is an empty string) the asset metadata (am) of the ASA is computed differently than if it is not specified.
 * @property {string} image - [optional] A URI pointing to a file with MIME type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
 * @property {string} image_integrity - [optional] The SHA-256 digest of the file pointed by the URI image. The field value is a single SHA-256 integrity metadata as defined in the W3C subresource integrity specification (https://w3c.github.io/webappsec-subresource-integrity).
 * @property {string} image_mimetype - [optional] The MIME type of the file pointed by the URI external_url. It is expected to be 'text/html' in almost all cases.
 * @property {IARC0003TokenMetadataLocalization} localization - [optional] Localization metadata.
 * @property {string} name - [optional] Identifies the asset to which this token represents.
 * @property {Properties} properties - [optional] Arbitrary properties (also called attributes). Values may be strings, numbers, object or arrays.
 */
interface IARC0003TokenMetadata<Properties = undefined> {
  animation_url?: string;
  animation_url_integrity?: string;
  animation_url_mimetype?: string;
  background_color?: string;
  decimals?: number;
  description?: string;
  external_url?: string;
  external_url_integrity?: string;
  external_url_mimetype?: string;
  extra_metadata?: string;
  image?: string;
  image_integrity?: string;
  image_mimetype?: string;
  localization?: IARC0003TokenMetadataLocalization;
  name?: string;
  properties?: Properties;
}

export default IARC0003TokenMetadata;
