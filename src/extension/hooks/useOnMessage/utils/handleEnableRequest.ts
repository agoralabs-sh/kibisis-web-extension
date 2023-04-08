// Errors
import { SerializableNetworkNotSupportedError } from '@common/errors';

// Features
import {
  setEnableRequest,
  sendEnableResponse,
} from '@extension/features/messages';
import { setSessionThunk } from '@extension/features/sessions';

// Types
import { IExtensionEnableRequestPayload } from '@common/types';
import { IAppThunkDispatch, INetwork, ISession } from '@extension/types';
import { IIncomingRequest } from '../types';

// Utils
import { selectDefaultNetwork } from '@extension/utils';

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

    dispatch(setSessionThunk(session));
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
      description: request.description,
      genesisHash: network.genesisHash,
      genesisId: network.genesisId,
      host: request.host,
      iconUrl: request.iconUrl,
      tabId: request.tabId,
    })
  );
}
