import {
  ARC0027MethodEnum,
  ARC0027UnknownError,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction, TransactionType } from 'algosdk';
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
  useSelectStandardAssets,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IBackgroundRootState,
  IClientRequestEvent,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type { IState } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

export default function useSignTransactionsModal(): IState {
  const _hookName = 'useSignTransactionsModal';
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  // selectors
  const events = useSelectEvents();
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const standardAssets = useSelectStandardAssets();
  // state
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
  // check for any unknown standard assets and fetch the asset information
  useEffect(() => {
    (async () => {
      let decodedUnsignedTransactions: Transaction[];
      let _error: string;

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
          _error = `failed to decode transactions: ${error.message}`;

          logger?.debug(`${_hookName}#useEffect: ${_error}`);

          await dispatch(
            sendSignTransactionsResponseThunk({
              error: new ARC0027UnknownError({
                message: _error,
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
            .filter((value) => value.type === TransactionType.axfer)
            .filter(
              (transaction) =>
                !standardAssets[encodedGenesisHash].some(
                  (value) => value.id === String(transaction.assetIndex)
                )
            )
            .map((value) => String(value.assetIndex));

          if (!network) {
            logger.debug(
              `${_hookName}#useEffect: unable to get network for genesis hash "${genesisHash}"`
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
    event,
  };
}
