import {
  ARC0027MethodEnum,
  ARC0027UnknownError,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// enums
import { EventTypeEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendSignTransactionsResponseThunk } from '@extension/features/messages';
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import {
  useSelectEvents,
  useSelectLogger,
  useSelectNetworks,
  useSelectNonWatchAccounts,
  useSelectSessions,
  useSelectStandardAssets,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IClientRequestEvent,
  INetwork,
  ISession,
} from '@extension/types';
import type { IUseSignTransactionsModalState } from './types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default function useSignTransactionsModal(): IUseSignTransactionsModalState {
  const _functionName = 'useSignTransactionsModal';
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const events = useSelectEvents();
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const sessions = useSelectSessions();
  const standardAssets = useSelectStandardAssets();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<
    IAccountWithExtendedProps[] | null
  >(null);
  const [event, setEvent] =
    useState<IClientRequestEvent<ISignTransactionsParams> | null>(null);

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.ClientRequest &&
          value.payload.message.method === ARC0027MethodEnum.SignTransactions
      ) as IClientRequestEvent<ISignTransactionsParams>) || null
    );
  }, [events]);
  useEffect(() => {
    (async () => {
      let authorizedAddresses: string[];
      let decodedUnsignedTransactions: Transaction[];
      let errorMessage: string;
      let filteredSessions: ISession[];
      let genesisHashes: string[];

      if (event && event.payload.message.params && !authorizedAccounts) {
        try {
          decodedUnsignedTransactions = event.payload.message.params.txns.map(
            (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
          );
        } catch (error) {
          errorMessage = `failed to decode transactions: ${error.message}`;

          logger?.debug(`${_functionName}: ${errorMessage}`);

          await dispatch(
            sendSignTransactionsResponseThunk({
              error: new ARC0027UnknownError({
                message: errorMessage,
                providerId: __PROVIDER_ID__,
              }),
              event,
              stxns: null,
            })
          ).unwrap();
          // remove the event
          await dispatch(removeEventByIdThunk(event.id)).unwrap();

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
          event.payload.message.clientInfo.host,
          filteredSessions
        );

        // set the authorized accounts and the event
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
    })();
  }, [accounts, events, sessions]);

  // check for any unknown standard assets and fetch the asset information
  useEffect(() => {
    (async () => {
      let decodedUnsignedTransactions: Transaction[];
      let errorMessage: string;

      if (
        event &&
        event.payload.message.params &&
        standardAssets &&
        networks.length > 0
      ) {
        try {
          decodedUnsignedTransactions = event.payload.message.params.txns.map(
            (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
          );
        } catch (error) {
          errorMessage = `failed to decode transactions: ${error.message}`;

          logger?.debug(`${_functionName}: ${errorMessage}`);

          await dispatch(
            sendSignTransactionsResponseThunk({
              error: new ARC0027UnknownError({
                message: errorMessage,
                providerId: __PROVIDER_ID__,
              }),
              event: event,
              stxns: null,
            })
          ).unwrap();
          // remove the event
          await dispatch(removeEventByIdThunk(event.id)).unwrap();

          return;
        }

        // for each genesis hash, find all the unknown asset ids in a matching network transaction and get the information
        uniqueGenesisHashesFromTransactions(
          decodedUnsignedTransactions
        ).forEach((genesisHash) => {
          const network: INetwork | null =
            networks.find((value) => value.genesisHash === genesisHash) || null;
          const encodedGenesisHash: string =
            convertGenesisHashToHex(genesisHash).toUpperCase();
          const unknownAssetIds: string[] = decodedUnsignedTransactions
            .filter((value) => value.type === 'axfer')
            .filter(
              (transaction) =>
                !standardAssets[encodedGenesisHash].some(
                  (value) => value.id === String(transaction.assetIndex)
                )
            )
            .map((value) => String(value.assetIndex));

          if (!network) {
            logger.debug(
              `${_functionName}: unable to get network for genesis hash "${genesisHash}"`
            );

            return;
          }

          // if we have some unknown assets, update the asset storage
          if (unknownAssetIds.length > 0) {
            dispatch(
              updateStandardAssetInformationThunk({
                ids: unknownAssetIds,
                network,
              })
            );
          }
        });
      }
    })();
  }, [event, standardAssets, networks]);

  return {
    authorizedAccounts,
    event,
    setAuthorizedAccounts,
  };
}
