import { useSelector } from 'react-redux';

// Types
import { IAccount, IMainRootState } from '@extension/types';

/**
 * Selects an account for the supplied public key.
 * @param {string} encodedPublicKey - the hexadecimal encoded public key of the account.
 * @returns {IAccount | null} the account for the supplied public key or null.
 */
export default function useSelectAccountByPublicKey(
  encodedPublicKey: string
): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    return (
      state.accounts.items.find(
        (value) =>
          value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
      ) || null
    );
  });
}
