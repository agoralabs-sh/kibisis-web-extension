import { v4 as uuid } from 'uuid';

// Types
import { IEnableRequest, ISession } from '../types';

export default function mapSessionFromEnableRequest({
  appName,
  authorizedAddresses,
  description,
  genesisHash,
  genesisId,
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
    genesisHash,
    genesisId,
    host,
    iconUrl,
    id,
    usedAt: now.getTime(),
  };
}
