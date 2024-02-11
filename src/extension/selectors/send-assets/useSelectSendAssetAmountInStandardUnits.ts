import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendAssetAmountInStandardUnits(): string {
  return useSelector<IMainRootState, string>(
    (state) => state.sendAssets.amountInStandardUnits
  );
}
