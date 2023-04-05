import { v4 as uuid } from 'uuid';

// Types
import { IAccount } from '../types';

interface IOptions {
  address: string;
  authAddress?: string;
  id?: string;
  name?: string;
}

/**
 * Convenience function to initializes a default account object.
 * @param {IOptions} options - various values to customize the returned account object.
 * @returns {IAccount} an initialized account object wih default values.
 */
export default function initializeDefaultAccount({
  address,
  authAddress,
  id,
  name,
}: IOptions): IAccount {
  return {
    address,
    atomicBalance: 'N/A',
    authAddress: authAddress || null,
    id: id || uuid(),
    minAtomicBalance: 'N/A',
    name: name || null,
    updatedAt: null,
  };
}
