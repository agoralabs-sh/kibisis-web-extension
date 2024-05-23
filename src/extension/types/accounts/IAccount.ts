// types
import IAccountInformation from './IAccountInformation';
import IAccountTransactions from './IAccountTransactions';

/**
 * @property {number} createdAt - a timestamp (in milliseconds) when this account was created in storage.
 * @property {string} id - a unique identifier (in UUID).
 * @property {string | null} name - a canonical name given to this account.
 * @property {Record<string, IAccountInformation>} networkInformation - information specific for each network, indexed by
 * their hex encoded genesis hash.
 * @property {Record<string, IAccountTransactions>} networkInformation - transactions specific for each network, indexed
 * by their hex encoded genesis hash.
 * @property {string} publicKey - the hexadecimal encoded public key.
 * @property {number} updatedAt - a timestamp (in milliseconds) for when this account was last saved to storage.
 */
interface IAccount {
  createdAt: number;
  id: string;
  name: string | null;
  networkInformation: Record<string, IAccountInformation>;
  networkTransactions: Record<string, IAccountTransactions>;
  publicKey: string;
  updatedAt: number;
}

export default IAccount;
