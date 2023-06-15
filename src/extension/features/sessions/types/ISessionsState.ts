import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';

// Types
import { ISession } from '@extension/types';

/**
 * @property {boolean} fetching - true fetching the sessions from storage.
 * @property {boolean} initializingWalletConnect - true if the Web3Wallet (WalletConnect) instance is initializing.
 * @property {ISession[]} items - the session items.
 * @property {boolean} saving - true saving the sessions from storage.
 * @property {IWeb3Wallet | null} web3Wallet - an initialized instance of Web3Wallet (WalletConnect).
 * @property {boolean} walletConnectModalOpen - true if the wallet connect modal is open.
 */
interface ISessionsState {
  fetching: boolean;
  initializingWalletConnect: boolean;
  items: ISession[];
  saving: boolean;
  web3Wallet: IWeb3Wallet | null;
  walletConnectModalOpen: boolean;
}

export default ISessionsState;
