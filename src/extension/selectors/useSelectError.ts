import { useSelector } from 'react-redux';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IBaseRootState } from '@extension/types';

export default function useSelectError(): BaseExtensionError | null {
  return useSelector<IBaseRootState, BaseExtensionError | null>(
    (state) => state.system.error
  );
}
