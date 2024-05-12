import {
  ARC0027UnknownError,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { sendSignTransactionsResponseThunk } from '@extension/features/messages';

// selectors
import {
  useSelectLogger,
  useSelectNonWatchAccounts,
  useSelectSessions,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IClientRequestEventPayload,
  IEvent,
  ISession,
} from '@extension/types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';

export default function useAuthorizedAccounts(
  signTransactionsRequest: IEvent<
    IClientRequestEventPayload<ISignTransactionsParams>
  > | null
): IAccountWithExtendedProps[] {
  const _functionName = 'useAuthorizedAccounts';
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const logger = useSelectLogger();
  const sessions = useSelectSessions();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<
    IAccountWithExtendedProps[]
  >([]);

  useEffect(() => {
    let authorizedAddresses: string[];
    let decodedUnsignedTransactions: Transaction[];
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];

    if (
      signTransactionsRequest &&
      signTransactionsRequest.payload.message.params
    ) {
      try {
        decodedUnsignedTransactions =
          signTransactionsRequest.payload.message.params.txns.map((value) =>
            decodeUnsignedTransaction(decodeBase64(value.txn))
          );
      } catch (error) {
        errorMessage = `failed to decode transactions: ${error.message}`;

        logger?.debug(`${_functionName}: ${errorMessage}`);

        dispatch(
          sendSignTransactionsResponseThunk({
            error: new ARC0027UnknownError({
              message: errorMessage,
              providerId: __PROVIDER_ID__,
            }),
            event: signTransactionsRequest,
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
        signTransactionsRequest.payload.message.clientInfo.host,
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
  }, [accounts, sessions, signTransactionsRequest]);

  return authorizedAccounts;
}
