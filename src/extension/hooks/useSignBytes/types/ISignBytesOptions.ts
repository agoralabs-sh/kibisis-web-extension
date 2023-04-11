/**
 * @property {string} encodedData - the base64 encoded data to be signed
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {string} signer - the address of the private key.
 */
interface ISignBytesOptions {
  encodedData: string;
  password: string;
  signer: string;
}

export default ISignBytesOptions;
