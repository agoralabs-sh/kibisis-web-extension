// Types
import { INetwork } from '@extension/types';

/**
 * @property {string} address - the address of the account.
 * @property {INetwork} network - the network this account belongs to.
 */
interface IUseAccountOptions {
  address: string;
  network: INetwork;
}

export default IUseAccountOptions;
