import { Algodv2, IntDecoding, waitForConfirmation } from 'algosdk';

// constants
import { TRANSACTION_CONFIRMATION_ROUNDS } from '@extension/constants';

// types
import type { IAlgorandPendingTransactionResponse } from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';

/**
 * Convenience function that signs and sends unsigned transactions.
 * @param {IOptions} options - the fields needed sign and send the transactions.
 * @returns {string[]} the transaction IDs.
 */
export default async function signAndSendTransactions({
  logger,
  network,
  privateKey,
  unsignedTransactions,
}: IOptions): Promise<string[]> {
  const _functionName: string = 'signAndSendTransactions';
  const algodClient: Algodv2 = createAlgodClient(network, { logger });
  let sentRawTransaction: { txId: string };
  let signedTransactions: Uint8Array[];
  let transactionsResponse: IAlgorandPendingTransactionResponse;

  logger?.debug(
    `${_functionName}: signing transactions "[${unsignedTransactions
      .map((value) => value.type)
      .join(',')}]"`
  );

  signedTransactions = unsignedTransactions.map((value) =>
    value.signTxn(privateKey)
  );

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

  return unsignedTransactions.map((value) => value.txID());
}
