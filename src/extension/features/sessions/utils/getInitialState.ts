// types
import { ISessionsState } from '../types';

export default function getInitialState(): ISessionsState {
  return {
    fetching: false,
    initializingWalletConnect: false,
    items: [],
    saving: false,
    web3Wallet: null,
    walletConnectModalOpen: false,
  };
}
