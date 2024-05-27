import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@extension/types';

export default function useSelectDeviceID(): string | null {
  return useSelector<IBaseRootState, string | null>(
    (state) => state.system.deviceID
  );
}
