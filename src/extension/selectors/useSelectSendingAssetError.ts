import { useSelector } from 'react-redux';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetError(): BaseExtensionError | null {
  return useSelector<IMainRootState, BaseExtensionError | null>(
    (state) => state.sendAssets.error
  );
}
