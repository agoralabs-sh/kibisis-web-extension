// types
import IAccountInformation from './IAccountInformation';

/**
 * @property {number} createdAt - a timestamp (in milliseconds) when this account was created in storage.
 * @property {string} id - a unique identifier (in UUID).
 * @property {Record<string, IAccountInformation>} networkInfo - information specific for each network, indexed by
 * their hex encoded genesis hash.
 * @property {string} publicKey - the hexadecimal encoded public key.
 * @property {number} updatedAt - a timestamp (in milliseconds) for when this account was last saved to storage.
 */
interface IAccount {
  createdAt: number;
  id: string;
  networkInfo: Record<string, IAccountInformation>;
  publicKey: string;
  updatedAt: number;
}

export default IAccount;
