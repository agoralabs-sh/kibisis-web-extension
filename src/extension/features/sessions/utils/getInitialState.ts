// types
import { IState } from '../types';

export default function getInitialState(): IState {
  return {
    fetching: false,
    initializingWalletConnect: false,
    items: [],
    saving: false,
    web3Wallet: null,
    walletConnectModalOpen: false,
  };
}
