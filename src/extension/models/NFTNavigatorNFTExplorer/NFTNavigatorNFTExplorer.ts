// models
import BaseNFTExplorer from '../BaseNFTExplorer';

// types
import type { TPartialExcept } from '@common/types';
import type {
  INewOptions,
  ITokensURLOptions,
} from '@extension/models/BaseNFTExplorer';

export default class NFTNavigatorNFTExplorer extends BaseNFTExplorer {
  constructor({
    baseURL,
    canonicalName,
    id,
  }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL,
      canonicalName: canonicalName || 'NFT Navigator',
      id: id || 'nft-navigator-nft-explorer',
    });
  }

  /**
   * public abstract functions
   */

  public collectionsURL(appID: string): string {
    return `${this._baseURL}/collection/${appID}`;
  }

  public tokensURL({ appID, tokenID }: ITokensURLOptions): string {
    return `${this._baseURL}/collection/${appID}/token/${tokenID}`;
  }
}
