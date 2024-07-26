// models
import BaseARC0072Indexer from '../BaseARC0072Indexer';

// types
import type {
  IARC0072AssetHolding,
  IARC0072IndexerFetchTokensByOwnerOptions,
} from '@extension/types';

export default class NautilusARC0072Indexer extends BaseARC0072Indexer {
  constructor() {
    super({
      baseURL: 'https://arc72-idx.nautilus.sh',
      canonicalName: 'Nautilus',
      id: 'nautilus-arc-0072-indexer',
    });
  }

  /**
   * public functions
   */

  public async fetchTokensByOwner(
    options: IARC0072IndexerFetchTokensByOwnerOptions
  ): Promise<IARC0072AssetHolding[]> {
    return await super.fetchTokensByOwner(options);
  }
}
