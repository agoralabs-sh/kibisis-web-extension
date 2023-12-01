import { useSelector } from 'react-redux';

// selectors
import useSelectAccount from './useSelectAccount';

// types
import { IAccount, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetFromAccount(): IAccount | null {
  const fromAddress: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.fromAddress
  );

  return useSelectAccount(fromAddress || undefined);
}
