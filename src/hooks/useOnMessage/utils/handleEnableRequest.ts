// Errors
import { SerializableNetworkNotSupportedError } from '../../../errors';

// Features
import {
  setEnableRequest,
  sendEnableResponse,
} from '../../../features/messages';
import { setSession } from '../../../features/sessions';

// Types
import {
  IAppThunkDispatch,
  IExtensionEnableRequestPayload,
  INetwork,
  ISession,
} from '../../../types';
import { IIncomingRequest } from '../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';

interface IOptions {
  networks: INetwork[];
  selectedNetwork: INetwork | null;
  sessions: ISession[];
}

export default function handleEnableRequest(
  dispatch: IAppThunkDispatch,
  request: IIncomingRequest<IExtensionEnableRequestPayload>,
  { networks, selectedNetwork, sessions }: IOptions
): void {
  let filteredSessions: ISession[] = sessions;
  let network: INetwork | null =
    selectedNetwork || selectDefaultNetwork(networks); // get the selected network or use the default
  let session: ISession | null;

  // get the network if a genesis hash is present
  if (request.genesisHash) {
    network =
      networks.find((value) => value.genesisHash === request.genesisHash) ||
      null;

    // if there is no network for the genesis hash, it isn't supported
    if (!network) {
      dispatch(
        sendEnableResponse({
          error: new SerializableNetworkNotSupportedError(request.genesisHash),
          session: null,
          tabId: request.tabId,
        })
      );

      return;
    }

    // filter the sessions by the specified genesis hash
    filteredSessions = sessions.filter(
      (value) => value.genesisHash === request.genesisHash
    );
  }

  session =
    filteredSessions.find((value) => value.host === request.host) || null;

  // if we have a session, update its use and return it
  if (session) {
    session = {
      ...session,
      usedAt: new Date().getTime(),
    };

    dispatch(setSession(session));
    dispatch(
      sendEnableResponse({
        error: null,
        session,
        tabId: request.tabId,
      })
    );

    return;
  }

  // otherwise, show the connect modal
  dispatch(
    setEnableRequest({
      appName: request.appName,
      authorizedAddresses: [],
      genesisHash: network.genesisHash,
      genesisId: network.genesisId,
      host: request.host,
      iconUrl: request.iconUrl,
      tabId: request.tabId,
    })
  );
}
