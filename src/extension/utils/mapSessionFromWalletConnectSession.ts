import { SessionTypes } from '@walletconnect/types';
import { v4 as uuid } from 'uuid';

// Types
import { INetwork, ISession } from '@extension/types';

interface IOptions {
  authorizedAddresses: string[];
  network: INetwork;
  walletConnectSession: SessionTypes.Struct;
}

export default function mapSessionFromWalletConnectSession({
  authorizedAddresses,
  network,
  walletConnectSession,
}: IOptions): ISession {
  const id: string = uuid();
  const now: Date = new Date();

  return {
    appName: walletConnectSession.peer.metadata.name,
    authorizedAddresses,
    createdAt: now.getTime(),
    description: walletConnectSession.peer.metadata.description,
    genesisHash: network.genesisHash,
    genesisId: network.genesisId,
    host: walletConnectSession.peer.metadata.url,
    iconUrl: walletConnectSession.peer.metadata.icons[0] || null,
    id,
    usedAt: now.getTime(),
    walletConnectMetadata: {
      expiresAt: walletConnectSession.expiry,
      namespaces: walletConnectSession.namespaces,
      topic: walletConnectSession.topic,
    },
  };
}
