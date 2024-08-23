import { Indexer } from 'algosdk';

// types
import type { IOptions } from '@common/utils/createAlgodClient';

/**
 * Creates an indexer client.
 * @param {IOptions} options - a URL, an optional port and optional token.
 * @returns {Indexer} an initialized indexer client.
 */
export default function createIndexerClient({
  port,
  token,
  url,
}: IOptions): Indexer {
  return new Indexer(token || '', url, port);
}
