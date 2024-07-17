/**
 * @property {string} algorithm - a number that is equal to a
 * {@link https://www.iana.org/assignments/cose/cose.xhtml#algorithms COSE Algorithm Identifier}, representing the
 * cryptographic algorithm used for the new credential.
 * @property {string} id - the hexadecimal encoded ID of the passkey credential.
 * @property {string} initializationVector - a hexadecimal encoded initialization vector used in the derivation of the
 * encryption key.
 * @property {string} name - the name given to this passkey.
 * @property {string | null} publicKey - the hexadecimal encoded public key of the passkey.
 * @property {string} salt - the hexadecimal encoded salt used in creation of the passkey.
 * @property {AuthenticatorTransport[]} transports - the transports of the passkey that were determined at creation.
 * @property {string} userID - the ID of the user. This should be the unique device (extension) ID.
 */
interface IPasskeyCredential {
  algorithm: number;
  id: string;
  initializationVector: string;
  name: string;
  publicKey: string | null;
  salt: string;
  transports: AuthenticatorTransport[];
  userID: string;
}

export default IPasskeyCredential;
