// Features
import { setSignDataRequest } from '../../../features/accounts';
import { sendSignBytesResponse } from '../../../features/messages';

// Errors
import { SerializableUnauthorizedSignerError } from '../../../errors';

// Types
import {
  IAppThunkDispatch,
  IExtensionSignBytesRequestPayload,
  ISession,
} from '../../../types';
import { IIncomingRequest } from '../types';

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
  const authorizedAddresses: string[] = filteredSessions.reduce<string[]>(
    (acc, session) => [
      ...acc,
      ...session.authorizedAddresses.filter(
        (address) => !acc.some((value) => address === value)
      ), // get unique any addresses
    ],
    []
  );

  // if the app has not been enabled
  if (filteredSessions.length <= 0) {
    dispatch(
      sendSignBytesResponse({
        encodedSignature: null,
        error: new SerializableUnauthorizedSignerError(
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
    setSignDataRequest({
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
