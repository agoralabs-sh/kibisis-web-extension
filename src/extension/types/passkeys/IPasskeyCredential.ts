/**
 * @property {string} id - the hexadecimal encoded ID of the passkey.
 * @property {string} initializationVector - a hexadecimal encoded initialization vector used in the derivation of the
 * encryption key.
 * @property {string} salt - the hexadecimal encoded salt used in creation of the passkey.
 * @property {AuthenticatorTransport[]} transports - the transports of the passkey that were determined at creation.
 */
interface IPasskeyCredential {
  id: string;
  initializationVector: string;
  salt: string;
  transports: AuthenticatorTransport[];
}

export default IPasskeyCredential;
