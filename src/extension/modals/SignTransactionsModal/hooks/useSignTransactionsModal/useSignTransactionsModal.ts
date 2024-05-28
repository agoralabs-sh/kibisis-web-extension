import {
  ARC0027MethodEnum,
  ARC0027UnknownError,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import type { Transaction } from 'algosdk';
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
  useSelectAccounts,
  useSelectEvents,
  useSelectLogger,
  useSelectNetworks,
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
  const accounts = useSelectAccounts();
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
      let _authorizedAccounts: IAccountWithExtendedProps[];
      let _error: string;
      let decodedUnsignedTransactions: Transaction[];

      if (
        event &&
        event.payload.message.params &&
        accounts.length > 0 &&
        !authorizedAccounts
      ) {
        try {
          decodedUnsignedTransactions = event.payload.message.params.txns.map(
            (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
          );
        } catch (error) {
          _error = `failed to decode transactions: ${error.message}`;

          logger?.debug(`${_functionName}: ${_error}`);

          await dispatch(
            sendSignTransactionsResponseThunk({
              error: new ARC0027UnknownError({
                message: _error,
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

        _authorizedAccounts = decodedUnsignedTransactions.reduce<
          IAccountWithExtendedProps[]
        >((acc, currentValue) => {
          const account = accounts.find(
            (value) =>
              value.publicKey ===
              AccountService.encodePublicKey(currentValue.from.publicKey)
          );
          const base64EncodedGenesisHash = encodeBase64(
            currentValue.genesisHash
          );
          const authorizedAddresses = getAuthorizedAddressesForHost(
            event.payload.message.clientInfo.host,
            sessions.filter(
              (value) => value.genesisHash === base64EncodedGenesisHash
            )
          );
          const network = networks.find(
            (value) => value.genesisHash === base64EncodedGenesisHash
          );
          const accountInformation =
            account && network
              ? AccountService.extractAccountInformationForNetwork(
                  account,
                  network
                )
              : null;

          // the from account is not an authorized account if:
          // * the account and account information is unknown for the network (inferred from the transaction's genesis hash)
          // * the account has already been added
          // * the account is not in the authorized addresses for a session matching the host and the genesis hash
          // * the account is a watch account but has not been re-keyed
          if (
            !account ||
            !accountInformation ||
            acc.find((value) => value.id === account?.id) ||
            !authorizedAddresses.find(
              (value) =>
                value ===
                AccountService.convertPublicKeyToAlgorandAddress(
                  account?.publicKey
                )
            ) ||
            (account.watchAccount && !accountInformation.authAddress)
          ) {
            return acc;
          }

          return [...acc, account];
        }, []);

        // set the authorized accounts and the event
        setAuthorizedAccounts(_authorizedAccounts);
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
