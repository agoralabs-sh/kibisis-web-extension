// types
import IAssetHolding from './IAssetHolding';

/**
 * @property {IAssetHolding} assetHoldings - the assets this account holds.
 * @property {string} atomicBalance - the atomic balance of this account as a string.
 * @property {string | null} authAddress - the address that this account has been rekeyed with.
 * @property {string} minAtomicBalance - the minimum balance for this account.
 * @property {number | null} updatedAt - a timestamp (in milliseconds) for when this account information was last
 * updated.
 */
interface IAccountInformation {
  assetHoldings: IAssetHolding[];
  atomicBalance: string;
  authAddress: string | null;
  minAtomicBalance: string;
  updatedAt: number | null;
}

export default IAccountInformation;
