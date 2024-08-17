import { Algodv2 } from 'algosdk';

// types
import type { IOptions } from './types';

/**
 * Creates an algod node client.
 * @param {IOptions} options - a url, an optional port and optional token.
 * @returns {Algodv2} an initialized algod client.
 */
export default function createAlgodClient({
  port,
  token,
  url,
}: IOptions): Algodv2 {
  return new Algodv2(token || '', url, port || '');
}
