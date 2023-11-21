import { CreateToastFnReturn } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// types
import { IBaseRootState } from '@extension/types';

export default function useSelectToast(): CreateToastFnReturn | null {
  return useSelector<IBaseRootState, CreateToastFnReturn | null>(
    (state) => state.system.toast
  );
}
