// types
import type { IAlgorandTransactionParams } from '@extension/types';
import type { IOptions } from './types';

/**
 * Fetches the transaction params for a give network.
 * @param {IBaseOptions} options - base options.
 * @returns {Promise<INetworkWithTransactionParams>} the network with updated transaction params.
 */
export default async function transactionParams({
  algodNode,
}: IOptions): Promise<IAlgorandTransactionParams> {
  let response: Response;

  // use rest api as the
  response = await fetch(
    new URL(
      `${algodNode.port ? `${algodNode.url}:${algodNode.port}` : algodNode.url}`
    ),
    {
      ...(algodNode.token && {
        headers: {
          ['X-Algo-API-Token']: algodNode.token,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
