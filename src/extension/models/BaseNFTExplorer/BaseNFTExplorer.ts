// types
import type { INewOptions, ITokensURLOptions } from './types';

export default abstract class BaseNFTExplorer {
  // protected variables
  protected readonly _baseURL: string;
  // public variables
  public readonly canonicalName: string;
  public readonly id: string;

  protected constructor({ baseURL, canonicalName, id }: INewOptions) {
    this._baseURL = baseURL;
    this.canonicalName = canonicalName;
    this.id = id;
  }

  /**
   * public abstract functions
   */

  public abstract collectionsURL(appID: string): string;

  public abstract tokensURL(options: ITokensURLOptions): string;
}
