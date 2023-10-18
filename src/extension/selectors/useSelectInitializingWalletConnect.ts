import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';
export default function useSelectInitializingWalletConnect(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.sessions.initializingWalletConnect
  );
}
