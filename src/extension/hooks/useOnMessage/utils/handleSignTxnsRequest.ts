import { decode as decodeBase64 } from '@stablelib/base64';
import { decodeUnsignedTransaction } from 'algosdk';

// Errors
import { SerializableUnauthorizedSignerError } from '@common/errors';

// Features
import {
  setSignBytesRequest,
  sendSignBytesResponse,
} from '@extension/features/messages';

// Types
import { IExtensionSignTxnsRequestPayload } from '@common/types';
import { IAppThunkDispatch, ISession } from '@extension/types';
import { IIncomingRequest } from '../types';

// Utils
import { getAuthorizedAddressesForHost } from '@extension/utils';

interface IOptions {
  sessions: ISession[];
}

export default function handleSignTxnsRequest(
  dispatch: IAppThunkDispatch,
  { host, tabId, txns }: IIncomingRequest<IExtensionSignTxnsRequestPayload>,
  { sessions }: IOptions
): void {
  const filteredSessions: ISession[] = sessions.filter(
    (value) => value.host === host
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

  console.log('host: ', host);
  console.log('tabId: ', tabId);
  console.log('txns: ', txns);

  txns.forEach((value) => {
    console.log(
      'txn: ',
      decodeUnsignedTransaction(decodeBase64(value.txn)).toString()
    );
  });
}
