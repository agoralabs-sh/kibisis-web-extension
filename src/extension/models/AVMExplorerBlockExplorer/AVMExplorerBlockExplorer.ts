// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

export default class AVMExplorerBlockExplorer extends BaseBlockExplorer {
  constructor(baseURL: string) {
    super({
      baseURL: baseURL,
      canonicalName: 'AVM Explorer',
      id: 'avm-explorer-block-explorer',
    });
  }

  /**
   * public functions
   */

  public accountURL(address: string): string {
    return `${this._baseURL}/address/${address}`;
  }

  public applicationURL(appID: string): string {
    return `${this._baseURL}/app/${appID}`;
  }

  public assetURL(assetID: string): string {
    return `${this._baseURL}/asset/${assetID}`;
  }

  public blockURL(block: string): string {
    return `${this._baseURL}/block/${block}`;
  }

  public groupURL(groupID: string): string {
    return `${this._baseURL}/group/${encodeURIComponent(groupID)}`;
  }

  public transactionURL(transactionID: string): string {
    return `${this._baseURL}/tx/${transactionID}`;
  }
}
