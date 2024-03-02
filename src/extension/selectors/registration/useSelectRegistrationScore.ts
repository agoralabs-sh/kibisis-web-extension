import { useSelector } from 'react-redux';

// types
import { IRegistrationRootState } from '@extension/types';
export default function useSelectRegistrationScore(): number {
  return useSelector<IRegistrationRootState, number>(
    (state) => state.registration.score
  );
}
