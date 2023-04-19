import { v4 as uuid } from 'uuid';

// Types
import { IAccount } from '@extension/types';

interface IOptions {
  address: string;
  authAddress?: string;
  createdAt?: number;
  genesisHash: string;
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
  createdAt,
  genesisHash,
  id,
  name,
}: IOptions): IAccount {
  return {
    address,
    atomicBalance: '0',
    assets: [],
    authAddress: authAddress || null,
    createdAt: createdAt || new Date().getTime(),
    genesisHash,
    id: id || uuid(),
    minAtomicBalance: '0',
    name: name || null,
    updatedAt: null,
  };
}
