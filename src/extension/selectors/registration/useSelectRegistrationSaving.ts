import { useSelector } from 'react-redux';

// types
import { IRegistrationRootState } from '@extension/types';
export default function useSelectRegistrationSaving(): boolean {
  return useSelector<IRegistrationRootState, boolean>(
    (state) => state.registration.saving
  );
}
