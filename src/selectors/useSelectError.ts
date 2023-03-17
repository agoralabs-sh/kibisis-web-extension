import { useSelector } from 'react-redux';

// Errors
import { BaseError } from '../errors';

// Types
import { IBaseRootState } from '../types';

export default function useSelectError(): BaseError | null {
  return useSelector<IBaseRootState, BaseError | null>(
    (state) => state.application.error
  );
}
