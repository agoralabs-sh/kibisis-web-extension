/**
 * @property {number} index - This indicates where the account sits in the derivation path within the Ledger.
 * @property {string} publicKey - The public key of the account.
 */
interface ILedgerAccount {
  index: number;
  publicKey: string;
}

export default ILedgerAccount;
