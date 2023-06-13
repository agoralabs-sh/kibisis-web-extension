import { useSelector } from 'react-redux';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { IBaseRootState } from '@extension/types';

export default function useSelectError(): BaseExtensionError | null {
  return useSelector<IBaseRootState, BaseExtensionError | null>(
    (state) => state.system.error
  );
}
