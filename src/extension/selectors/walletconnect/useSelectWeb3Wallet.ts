import type { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';
import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectWeb3Wallet(): IWeb3Wallet | null {
  return useSelector<IMainRootState, IWeb3Wallet | null>(
    (state) => state.sessions.web3Wallet
  );
}
