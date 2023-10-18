import { v4 as uuid } from 'uuid';

// Types
import { IEnableRequest, ISession } from '@extension/types';

export default function mapSessionFromEnableRequest({
  appName,
  authorizedAddresses,
  description,
  network,
  host,
  iconUrl,
}: IEnableRequest): ISession {
  const id: string = uuid();
  const now: Date = new Date();

  return {
    appName,
    authorizedAddresses,
    createdAt: now.getTime(),
    description,
    genesisHash: network.genesisHash,
    genesisId: network.genesisId,
    host,
    iconUrl,
    id,
    usedAt: now.getTime(),
    walletConnectMetadata: null,
  };
}
