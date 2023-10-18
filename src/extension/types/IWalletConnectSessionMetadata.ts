import { SessionTypes } from '@walletconnect/types';

/**
 * @property {number} expiresAt - a timestamp (in milliseconds) for when this session was expires.
 * @property {SessionTypes.Namespaces} namespaces - the namespaces available for this session.
 * @property {string} topic - the WalletConnect topic for this session.
 */
interface IWalletConnectSessionMetadata {
  expiresAt: number;
  namespaces: SessionTypes.Namespaces;
  topic: string;
}

export default IWalletConnectSessionMetadata;
