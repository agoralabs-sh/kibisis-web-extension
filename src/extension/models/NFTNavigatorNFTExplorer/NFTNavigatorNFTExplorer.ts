// models
import BaseNFTExplorer from '../BaseNFTExplorer';

// types
import type { ITokensURLOptions } from '../BaseNFTExplorer';

export default class NFTNavigatorNFTExplorer extends BaseNFTExplorer {
  constructor() {
    super({
      baseURL: 'https://arc72-idx.nftnavigator.xyz',
      canonicalName: 'NFT Navigator',
      id: 'nft-navigator-arc-0072-indexer',
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
