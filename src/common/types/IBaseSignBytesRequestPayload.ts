/**
 * @property {string} encodedData - the base64 encoded data to be signed.
 * @property {string | null} signer - the specific signer.
 */
interface IBaseSignBytesRequestPayload {
  encodedData: string;
  signer: string | null;
}

export default IBaseSignBytesRequestPayload;
