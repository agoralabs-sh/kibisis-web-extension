import { Algodv2, IntDecoding, waitForConfirmation } from 'algosdk';

// constants
import { TRANSACTION_CONFIRMATION_ROUNDS } from '@extension/constants';

// types
import type { IAlgorandPendingTransactionResponse } from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';

/**
 * Convenience function that sends signed transactions to the network.
 * @param {IOptions} options - the network and the signed transactions.
 * @returns {string} the round a transaction was confirmed in.
 */
export default async function sendTransactionsForNetwork({
  logger,
  network,
  signedTransactions,
}: IOptions): Promise<string> {
  const _functionName = 'sendTransactions';
  let algodClient: Algodv2;
  let sentRawTransaction: { txId: string };
  let transactionsResponse: IAlgorandPendingTransactionResponse;

  algodClient = createAlgodClient(network);

  logger?.debug(
    `${_functionName}: sending transactions to the network "${network.genesisId}"`
  );

  sentRawTransaction = await algodClient
    .sendRawTransaction(signedTransactions)
    .setIntDecoding(IntDecoding.BIGINT)
    .do();

  logger?.debug(
    `${_functionName}: transaction "${sentRawTransaction.txId}" sent to the network "${network.genesisId}", confirming`
  );

  transactionsResponse = (await waitForConfirmation(
    algodClient,
    sentRawTransaction.txId,
    TRANSACTION_CONFIRMATION_ROUNDS
  )) as IAlgorandPendingTransactionResponse;

  logger?.debug(
    `${_functionName}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionsResponse['confirmed-round']}"`
  );

  return String(transactionsResponse['confirmed-round']);
}
