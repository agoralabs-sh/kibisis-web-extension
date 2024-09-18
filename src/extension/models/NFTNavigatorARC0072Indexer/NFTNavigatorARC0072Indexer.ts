// models
import BaseARC0072Indexer from '../BaseARC0072Indexer';

// types
import type { TPartialExcept } from '@common/types';
import type {
  IFetchTokensByOwnerOptions,
  INewOptions,
} from '@extension/models/BaseARC0072Indexer';
import type { IARC0072AssetHolding } from '@extension/types';

export default class NFTNavigatorARC0072Indexer extends BaseARC0072Indexer {
  constructor({
    baseURL,
    canonicalName,
    id,
  }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL,
      canonicalName: canonicalName || 'NFT Navigator',
      id: id || 'nft-navigator-arc-0072-indexer',
    });
  }

  /**
   * public functions
   */

  public async fetchTokensByOwner(
    options: IFetchTokensByOwnerOptions
  ): Promise<IARC0072AssetHolding[]> {
    return await super.fetchTokensByOwner(options);
  }
}
