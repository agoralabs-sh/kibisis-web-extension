/**
 * @property {string} id - a UUIDv4 compliant identifier.
 * @property {string} encryptedTag - a hexadecimal encoded string of the encrypted password tag.
 * @property {number} version - the version of the password tag.
 */
interface IPasswordTag {
  id: string;
  encryptedTag: string;
  version: number;
}

export default IPasswordTag;
