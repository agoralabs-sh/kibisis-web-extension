import { useSelector } from 'react-redux';

// selectors
import useSelectAccountByAddress from './useSelectAccountByAddress';

// types
import { IAccount, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetFromAccount(): IAccount | null {
  const fromAddress: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.fromAddress
  );

  if (!fromAddress) {
    return null;
  }

  return useSelectAccountByAddress(fromAddress);
}
