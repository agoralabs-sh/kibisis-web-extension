/**
 * @property {string} id - the ID of the account being updated.
 * @property {boolean} information - whether the information is being updated.
 * @property {boolean} transactions - whether the transactions are being updated.
 */
interface IAccountUpdate {
  id: string;
  information: boolean;
  transactions: boolean;
}

export default IAccountUpdate;
