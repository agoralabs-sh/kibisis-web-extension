import { useSelector } from 'react-redux';

// Errors
import { BaseError } from '../errors';

// Types
import { IRootState } from '../types';

export default function useSelectError(): BaseError | null {
  return useSelector<IRootState, BaseError | null>(
    (state) => state.application.error
  );
}
