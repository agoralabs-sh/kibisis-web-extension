// Errors
import { SerializableUnauthorizedSignerError } from '@common/errors';

// Features
import {
  setSignBytesRequest,
  sendSignBytesResponse,
} from '@extension/features/messages';

// Types
import { IBaseOptions, IExtensionSignBytesRequestPayload } from '@common/types';
import { IAppThunkDispatch, ISession } from '@extension/types';
import { IIncomingRequest } from '../types';

// Utils
import { getAuthorizedAddressesForHost } from '@extension/utils';

interface IOptions extends IBaseOptions {
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
  { logger, sessions }: IOptions
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
    logger &&
      logger.debug(
        `${handleSignBytesRequest.name}(): no sessions found for sign bytes request`
      );

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
    logger &&
      logger.debug(
        `${handleSignBytesRequest.name}(): signer "${signer}" is not authorized`
      );

    dispatch(
      sendSignBytesResponse({
        encodedSignature: null,
        error: new SerializableUnauthorizedSignerError(signer),
        tabId,
      })
    );

    return;
  }

  // show the sign bytes modal
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
