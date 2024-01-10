import { v4 as uuid } from 'uuid';

// types
import { IClientInformation } from '@common/types';
import { INetwork, ISession } from '@extension/types';

export interface IOptions {
  authorizedAddresses: string[];
  clientInfo: IClientInformation;
  network: INetwork;
}

export default function mapSessionFromEnableRequest({
  authorizedAddresses,
  clientInfo,
  network,
}: IOptions): ISession {
  const id: string = uuid();
  const now: Date = new Date();

  return {
    appName: clientInfo.appName,
    authorizedAddresses,
    createdAt: now.getTime(),
    description: clientInfo.description,
    genesisHash: network.genesisHash,
    genesisId: network.genesisId,
    host: clientInfo.host,
    iconUrl: clientInfo.iconUrl,
    id,
    usedAt: now.getTime(),
    walletConnectMetadata: null,
  };
}
