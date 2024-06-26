// types
import type { IARC0072AssetHolding } from '../asset-holdings';
import type IARC0072IndexerFetchTokensByOwnerOptions from './IARC0072IndexerFetchTokensByOwnerOptions';

interface IARC0072Indexer {
  canonicalName: string;
  fetchTokensByOwner: (
    options: IARC0072IndexerFetchTokensByOwnerOptions
  ) => Promise<IARC0072AssetHolding[]>;
  id: string;
}

export default IARC0072Indexer;
