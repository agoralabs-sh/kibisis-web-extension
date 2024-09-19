/**
 * @property {string} accountIDs - the IDs of the accounts being updated.
 * @property {string} requestID - the ID of the request.
 * @property {boolean} information - whether the information is being updated.
 * @property {boolean} transactions - whether the transactions are being updated.
 */
interface IAccountUpdateRequest {
  accountIDs: string[];
  requestID: string;
  information: boolean;
  transactions: boolean;
}

export default IAccountUpdateRequest;
