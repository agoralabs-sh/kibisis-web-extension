/**
 * @property {string} fee - the suggested transaction fee, in atomic units.
 * @property {string} minFee - the minimum transaction fee, in atomic units, (not per byte) required for the
 * txn to validate for the current network protocol.
 * @property {number} updatedAt - a timestamp (in milliseconds) for when thw network was last queried.
 */
interface ITransactionParams {
  fee: string;
  minFee: string;
  updatedAt: number;
}

export default ITransactionParams;
