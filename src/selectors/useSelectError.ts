import { useSelector } from 'react-redux';

// Errors
import { BaseExtensionError } from '../errors';

// Types
import { IBaseRootState } from '../types';

export default function useSelectError(): BaseExtensionError | null {
  return useSelector<IBaseRootState, BaseExtensionError | null>(
    (state) => state.application.error
  );
}
