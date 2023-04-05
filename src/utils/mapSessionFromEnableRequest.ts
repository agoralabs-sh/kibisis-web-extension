import { v4 as uuid } from 'uuid';

// Types
import { IEnableRequest, ISession } from '../types';

export default function mapSessionFromEnableRequest({
  appName,
  authorizedAddresses,
  genesisHash,
  genesisId,
  host,
}: IEnableRequest): ISession {
  const id: string = uuid();
  const now: Date = new Date();

  return {
    appName,
    authorizedAddresses,
    createdAt: Math.round(now.getTime() / 1000),
    genesisHash,
    genesisId,
    host,
    id,
    usedAt: Math.round(now.getTime() / 1000),
  };
}
