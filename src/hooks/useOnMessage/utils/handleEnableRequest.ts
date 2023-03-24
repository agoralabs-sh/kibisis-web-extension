// Errors
import { SerializableNetworkNotSupportedError } from '../../../errors';

// Features
import { sendEnableResponse } from '../../../features/messages';
import { saveSession, setConnectRequest } from '../../../features/sessions';

// Types
import { IAppThunkDispatch, INetwork, ISession } from '../../../types';
import { IIncomingEnableRequest } from '../types';

interface IOptions {
  networks: INetwork[];
  selectedNetwork: INetwork | null;
  sessions: ISession[];
}

export default function handleEnableRequest(
  dispatch: IAppThunkDispatch,
  enableRequest: IIncomingEnableRequest,
  { networks, selectedNetwork, sessions }: IOptions
): void {
  let filteredSessions: ISession[] = sessions;
  let network: INetwork = selectedNetwork || networks[0]; // get the selected network or use the default
  let session: ISession | null;

  // get the network if a genesis hash is present
  if (enableRequest.genesisHash) {
    network = networks.find(
      (value) => value.genesisHash === enableRequest.genesisHash
    );

    // if there is no network for the genesis hash, it isn't supported
    if (!network) {
      dispatch(
        sendEnableResponse({
          error: new SerializableNetworkNotSupportedError(
            enableRequest.genesisHash
          ),
          session: null,
          tabId: enableRequest.tabId,
        })
      );

      return;
    }

    // filter the sessions by the specified genesis hash
    filteredSessions = sessions.filter(
      (value) => value.genesisHash === enableRequest.genesisHash
    );
  }

  session =
    filteredSessions.find((value) => value.host === enableRequest.host) || null;

  // if we have a session, update its use and return it
  if (session) {
    session = {
      ...session,
      usedAt: Math.round(new Date().getTime() / 1000),
    };

    dispatch(saveSession(session));
    dispatch(
      sendEnableResponse({
        error: null,
        session,
        tabId: enableRequest.tabId,
      })
    );

    return;
  }

  // otherwise, show the connect modal
  dispatch(
    setConnectRequest({
      authorizedAddresses: [],
      appName: enableRequest.appName,
      genesisHash: network.genesisHash,
      genesisId: network.genesisId,
      host: enableRequest.host,
      iconUrl: enableRequest.iconUrl,
      tabId: enableRequest.tabId,
    })
  );
}
