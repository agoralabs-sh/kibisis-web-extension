import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectWalletConnectModalOpen(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.sessions.walletConnectModalOpen
  );
}
