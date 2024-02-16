import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// errors
import { SerializableArc0027UnknownError } from '@common/errors';

// features
import { sendSignTxnsResponseThunk } from '@extension/features/messages';
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// messages
import { Arc0027SignTxnsRequestMessage } from '@common/messages';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectStandardAssets,
} from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IAppThunkDispatch,
  IClientRequest,
  INetwork,
  IStandardAsset,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

export default function useUpdateStandardAssetInformation(
  signTxnsRequest: IClientRequest<Arc0027SignTxnsRequestMessage> | null
): void {
  const _functionName: string = 'useUpdateStandardAssetsForTransactions';
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const standardAssets: Record<string, IStandardAsset[]> | null =
    useSelectStandardAssets();

  useEffect(() => {
    let decodedUnsignedTransactions: Transaction[];
    let errorMessage: string;

    if (
      signTxnsRequest &&
      signTxnsRequest.originMessage.params &&
      standardAssets &&
      networks.length > 0
    ) {
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
            error: new SerializableArc0027UnknownError(
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

      // for each genesis hash, find all the unknown asset ids in a matching network transaction and get the information
      uniqueGenesisHashesFromTransactions(decodedUnsignedTransactions).forEach(
        (genesisHash) => {
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
        }
      );
    }
  }, [signTxnsRequest, standardAssets, networks]);
}
