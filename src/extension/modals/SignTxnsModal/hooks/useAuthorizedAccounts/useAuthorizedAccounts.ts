import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// errors
import { SerializableARC0027UnknownError } from '@common/errors';

// features
import { sendSignTxnsResponseThunk } from '@extension/features/messages';

// messages
import { ARC0027SignTxnsRequestMessage } from '@common/messages';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectSessions,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAppThunkDispatch,
  IClientRequest,
  ISession,
} from '@extension/types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';

export default function useAuthorizedAccounts(
  signTxnsRequest: IClientRequest<ARC0027SignTxnsRequestMessage> | null
): IAccount[] {
  const _functionName: string = 'useAuthorizedAccounts';
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger: ILogger = useSelectLogger();
  const sessions: ISession[] = useSelectSessions();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    let authorizedAddresses: string[];
    let decodedUnsignedTransactions: Transaction[];
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];

    if (signTxnsRequest && signTxnsRequest.originMessage.params) {
      try {
        decodedUnsignedTransactions =
          signTxnsRequest.originMessage.params.txns.map((value) =>
            decodeUnsignedTransaction(decodeBase64(value.txn))
          );
      } catch (error) {
        errorMessage = `failed to decode transactions: ${error.message}`;

        logger?.debug(`${_functionName}: ${errorMessage}`);

        dispatch(
          sendSignTxnsResponseThunk({
            error: new SerializableARC0027UnknownError(
              __PROVIDER_ID__,
              errorMessage
            ),
            eventId: signTxnsRequest.eventId,
            originMessage: signTxnsRequest.originMessage,
            originTabId: signTxnsRequest.originTabId,
            stxns: null,
          })
        );

        return;
      }

      genesisHashes = uniqueGenesisHashesFromTransactions(
        decodedUnsignedTransactions
      );

      // filter sessions by the available genesis hashes
      filteredSessions = sessions.filter((session) =>
        genesisHashes.some((value) => value === session.genesisHash)
      );
      authorizedAddresses = getAuthorizedAddressesForHost(
        signTxnsRequest.clientInfo.host,
        filteredSessions
      );

      // set the authorized accounts
      setAuthorizedAccounts(
        accounts.filter((account) =>
          authorizedAddresses.some(
            (value) =>
              value ===
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )
          )
        )
      );
    }
  }, [accounts, sessions, signTxnsRequest]);

  return authorizedAccounts;
}
