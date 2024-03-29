// types
import IARC0072AssetHolding from './IARC0072AssetHolding';
import IARC0200AssetHolding from './IARC0200AssetHolding';
import IStandardAssetHolding from './IStandardAssetHolding';

/**
 * @property {IARC0072AssetHolding} arc0072AssetHoldings - the ARC-0072 assets this account holds.
 * @property {IARC0200AssetHolding} arc200AssetHoldings - the ARC-0200 assets this account holds.
 * @property {string} atomicBalance - the atomic balance of this account as a string.
 * @property {string | null} authAddress - the address that this account has been rekeyed with.
 * @property {string} minAtomicBalance - the minimum balance for this account.
 * @property {IStandardAssetHolding} standardAssetHoldings - the standard assets this account holds.
 * @property {number | null} updatedAt - a timestamp (in milliseconds) for when this account information was last
 * updated.
 */
interface IAccountInformation {
  arc0072AssetHoldings: IARC0072AssetHolding[];
  arc200AssetHoldings: IARC0200AssetHolding[];
  atomicBalance: string;
  authAddress: string | null;
  minAtomicBalance: string;
  standardAssetHoldings: IStandardAssetHolding[];
  updatedAt: number | null;
}

export default IAccountInformation;
