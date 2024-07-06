/**
 * @property {string} id - the hexadecimal encoded ID of the passkey.
 * @property {string} salt - the hexadecimal encoded salt used in creation of the passkey.
 * @property {string[]} transports - the transports of the passkey that were determined at creation.
 */
interface IPasskey {
  id: string;
  salt: string;
  transports: string[];
}

export default IPasskey;
