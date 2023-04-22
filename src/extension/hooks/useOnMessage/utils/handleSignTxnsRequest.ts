import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { decodeUnsignedTransaction, Transaction } from 'algosdk';

// Errors
import {
  SerializableInvalidGroupIdError,
  SerializableInvalidInputError,
  SerializableNetworkNotSupportedError,
  SerializableUnauthorizedSignerError,
} from '@common/errors';

// Features
import {
  setSignTxnsRequest,
  sendSignTxnsResponse,
} from '@extension/features/messages';

// Types
import { IBaseOptions, IExtensionSignTxnsRequestPayload } from '@common/types';
import { IAppThunkDispatch, INetwork, ISession } from '@extension/types';
import { IIncomingRequest } from '../types';

// Utils
import { computeGroupId } from '@common/utils';
import { verifyTransactionGroupId } from '@extension/utils';

interface IOptions extends IBaseOptions {
  networks: INetwork[];
  sessions: ISession[];
}

export default function handleSignTxnsRequest(
  dispatch: IAppThunkDispatch,
  {
    appName,
    host,
    iconUrl,
    tabId,
    txns,
  }: IIncomingRequest<IExtensionSignTxnsRequestPayload>,
  { logger, networks, sessions }: IOptions
): void {
  let authorizedAddresses: string[];
  let decodedUnsignedTransactions: Transaction[];
  let encodedComputedGroupId: string;
  let errorMessage: string;
  let filteredSessions: ISession[];
  let genesisHashes: string[];
  let genesisHash: string;
  let network: INetwork | null;

  // attempt to decode the transactions
  try {
    decodedUnsignedTransactions = txns.map((value) =>
      decodeUnsignedTransaction(decodeBase64(value.txn))
    );
  } catch (error) {
    errorMessage = `failed to decode transactions: ${error.message}`;

    logger && logger.debug(`${handleSignTxnsRequest.name}(): ${errorMessage}`);

    dispatch(
      sendSignTxnsResponse({
        error: new SerializableInvalidInputError(errorMessage),
        signedTransactions: null,
        tabId,
      })
    );

    return;
  }

  // validate the transaction group ids
  if (!verifyTransactionGroupId(decodedUnsignedTransactions)) {
    encodedComputedGroupId = encodeBase64(
      computeGroupId(decodedUnsignedTransactions)
    );
    errorMessage = `the computed group id "${encodedComputedGroupId}" does not match the assigned transaction group ids [${decodedUnsignedTransactions.map(
      (value) => `"${value.group ? encodeBase64(value.group) : 'undefined'}"`
    )}]`;

    logger && logger.debug(`${handleSignTxnsRequest.name}(): ${errorMessage}`);

    dispatch(
      sendSignTxnsResponse({
        error: new SerializableInvalidGroupIdError(
          encodedComputedGroupId,
          errorMessage
        ),
        signedTransactions: null,
        tabId,
      })
    );

    return;
  }

  genesisHashes = decodedUnsignedTransactions.reduce<string[]>(
    (acc, transaction) => {
      const genesisHash: string = encodeBase64(transaction.genesisHash);

      return acc.some((value) => value === genesisHash)
        ? acc
        : [...acc, genesisHash];
    },
    []
  );

  // there should only be one genesis hash
  if (genesisHashes.length > 1) {
    errorMessage = `the transaction group is not atomic, they are bound for multiple networks: [${genesisHashes.join(
      ','
    )}]`;

    logger && logger.debug(`${handleSignTxnsRequest.name}(): ${errorMessage}`);

    dispatch(
      sendSignTxnsResponse({
        error: new SerializableInvalidInputError(errorMessage),
        signedTransactions: null,
        tabId,
      })
    );

    return;
  }

  genesisHash = genesisHashes[0];
  network = networks.find((value) => value.genesisHash === genesisHash) || null;

  if (!network) {
    logger &&
      logger.debug(
        `${handleSignTxnsRequest.name}(): genesis hash "${genesisHash}" is not supported`
      );

    dispatch(
      sendSignTxnsResponse({
        error: new SerializableNetworkNotSupportedError(genesisHash),
        signedTransactions: null,
        tabId,
      })
    );

    return;
  }

  filteredSessions = sessions.filter(
    (value) => value.host === host && value.genesisHash === genesisHashes[0]
  );

  // if the app has not been enabled
  if (filteredSessions.length <= 0) {
    logger &&
      logger.debug(
        `${handleSignTxnsRequest.name}(): no sessions found for sign txns request`
      );

    dispatch(
      sendSignTxnsResponse({
        error: new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
          '',
          'app has not been authorized'
        ),
        signedTransactions: null,
        tabId,
      })
    );

    return;
  }

  authorizedAddresses = filteredSessions.reduce<string[]>(
    (acc, session) => [
      ...acc,
      ...session.authorizedAddresses.filter(
        (address) => !acc.some((value) => address === value)
      ), // get only unique addresses
    ],
    []
  );

  // show the sign txns modal
  dispatch(
    setSignTxnsRequest({
      appName,
      authorizedAddresses,
      network,
      host,
      iconUrl,
      tabId,
      transactions: txns,
    })
  );
}
