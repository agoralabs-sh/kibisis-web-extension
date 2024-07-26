// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

export default class PeraBlockExplorer extends BaseBlockExplorer {
  constructor(baseURL: string) {
    super({
      baseURL: baseURL,
      canonicalName: 'Pera',
      id: 'pera-block-explorer',
    });
  }

  /**
   * public functions
   */

  public accountURL(address: string): string {
    return `${this._baseURL}/address/${address}`;
  }

  public applicationURL(appID: string): string {
    return `${this._baseURL}/application/${appID}`;
  }

  public assetURL(assetID: string): string {
    return `${this._baseURL}/asset/${assetID}`;
  }

  public blockURL(block: string): string {
    return `${this._baseURL}/block/${block}`;
  }

  public groupURL(groupID: string): string {
    return `${this._baseURL}/tx-group/${encodeURIComponent(groupID)}`;
  }

  public transactionURL(transactionID: string): string {
    return `${this._baseURL}/tx/${transactionID}`;
  }
}
