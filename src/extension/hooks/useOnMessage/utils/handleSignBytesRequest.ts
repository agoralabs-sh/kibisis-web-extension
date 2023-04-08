// Errors
import { SerializableUnauthorizedSignerError } from '@common/errors';

// Features
import {
  setSignBytesRequest,
  sendSignBytesResponse,
} from '@extension/features/messages';

// Types
import { IExtensionSignBytesRequestPayload } from '@common/types';
import { IAppThunkDispatch, ISession } from '@extension/types';
import { IIncomingRequest } from '../types';

// Utils
import { getAuthorizedAddressesForHost } from '@extension/utils';

interface IOptions {
  sessions: ISession[];
}

export default function handleSignBytesRequest(
  dispatch: IAppThunkDispatch,
  {
    appName,
    encodedData,
    host,
    iconUrl,
    signer,
    tabId,
  }: IIncomingRequest<IExtensionSignBytesRequestPayload>,
  { sessions }: IOptions
): void {
  const filteredSessions: ISession[] = sessions.filter(
    (value) => value.host === host
  );
  const authorizedAddresses: string[] = getAuthorizedAddressesForHost(
    host,
    filteredSessions
  );

  // if the app has not been enabled
  if (filteredSessions.length <= 0) {
    dispatch(
      sendSignBytesResponse({
        encodedSignature: null,
        error: new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
          '',
          'app has not been authorized'
        ),
        tabId,
      })
    );

    return;
  }

  // if the requested signer has not been authorized
  if (signer && !authorizedAddresses.find((value) => value === signer)) {
    dispatch(
      sendSignBytesResponse({
        encodedSignature: null,
        error: new SerializableUnauthorizedSignerError(signer),
        tabId,
      })
    );

    return;
  }

  // show the sign data modal
  dispatch(
    setSignBytesRequest({
      appName,
      authorizedAddresses,
      encodedData,
      host,
      iconUrl,
      signer,
      tabId,
    })
  );
}
