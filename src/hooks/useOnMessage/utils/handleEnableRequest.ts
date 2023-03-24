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
  let defaultNetwork: INetwork;
  let filteredSessions: ISession[] = sessions;
  let session: ISession | null;

  // check if the incoming network is supported
  if (
    enableRequest.genesisHash &&
    !networks.find((value) => value.genesisHash === enableRequest.genesisHash)
  ) {
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

  // if there is a genesis hash specified, filter the sessions by genesis hash
  if (enableRequest.genesisHash) {
    filteredSessions = sessions.filter(
      (value) => value.genesisHash === enableRequest.genesisHash
    );
  }

  session =
    filteredSessions.find((value) => value.host === enableRequest.host) || null;

  // if we have a session, just return that
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

  defaultNetwork = selectedNetwork || networks[0]; // get the selected network or use the default

  // otherwise, show the connect modal
  dispatch(
    setConnectRequest({
      authorizedAddresses: [],
      appName: enableRequest.appName,
      genesisHash: enableRequest.genesisHash || defaultNetwork.genesisHash,
      host: enableRequest.host,
      iconUrl: enableRequest.iconUrl,
      tabId: enableRequest.tabId,
    })
  );
}
