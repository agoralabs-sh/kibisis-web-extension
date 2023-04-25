import {
  Algodv2,
  generateAccount,
  makeAssetCreateTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import { faker } from '@faker-js/faker';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
}

export default async function createAssetCreateTransaction({
  from,
  network,
  note,
}: IOptions): Promise<Transaction> {
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  return makeAssetCreateTxnWithSuggestedParams(
    from,
    note ? new TextEncoder().encode(note) : undefined,
    BigInt('18446744073709551615'),
    6,
    false,
    Math.random() < 0.5 ? generateAccount().addr : undefined, // randomize the chance to add an address
    Math.random() < 0.5 ? generateAccount().addr : undefined,
    Math.random() < 0.5 ? generateAccount().addr : undefined,
    Math.random() < 0.5 ? generateAccount().addr : undefined,
    faker.finance.currencyCode(),
    faker.finance.currencyName(),
    'https://kibis.is',
    undefined,
    suggestedParams
  );
}
