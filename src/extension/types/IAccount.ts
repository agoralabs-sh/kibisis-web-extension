// Types
import IAssetHolding from './IAssetHolding';

/**
 * @property {string} address - the address of this account.
 * @property {IAssetHolding} assets - the assets this account holds.
 * @property {string} atomicBalance - the atomic balance of this account as a string.
 * @property {string | null} authAddress - the address that this account has been rekeyed with.
 * @property {number} createdAt - a timestamp (in seconds) when this account was created.
 * @property {string} genesisHash - the genesis has to which this account belongs to.
 * @property {string} id - a unique identifier (in UUID).
 * @property {string} minAtomicBalance - the minimum balance for this account.
 * @property {string | null} name - a canonical name given to this account.
 * @property {number | null} name - a timestamp (in seconds) as to when this account information was updated.
 */
interface IAccount {
  address: string;
  assets: IAssetHolding[];
  atomicBalance: string;
  authAddress: string | null;
  createdAt: number;
  genesisHash: string;
  id: string;
  minAtomicBalance: string;
  name: string | null;
  updatedAt: number | null;
}

export default IAccount;
