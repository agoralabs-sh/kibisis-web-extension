/**
 * @property {string} encodedSignature - the base64 encoded signature of the signed data with the MX prefix.
 */
interface IBaseSignBytesResponsePayload {
  encodedSignature: string;
}

export default IBaseSignBytesResponsePayload;
