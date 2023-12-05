import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetTransactionId(): string | null {
  return useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.transactionId
  );
}
