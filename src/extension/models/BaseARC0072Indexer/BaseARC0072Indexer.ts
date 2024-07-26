// enums
import { AssetTypeEnum } from '@extension/enums';

// errors
import {
  MalformedDataError,
  NetworkConnectionError,
  UnknownError,
} from '@extension/errors';

// types
import type { IARC0072AssetHolding } from '@extension/types';
import type {
  IFetchTokensByOwnerOptions,
  INewOptions,
  ITokensResponse,
} from './types';

export default abstract class BaseARC0072Indexer {
  // protected variables
  protected readonly _baseURL: string;
  protected readonly _apiPath: string = '/nft-indexer/v1';
  // public variables
  public readonly canonicalName: string;
  public readonly id: string;

  protected constructor({ baseURL, canonicalName, id }: INewOptions) {
    this._baseURL = baseURL;
    this.canonicalName = canonicalName;
    this.id = id;
  }

  /**
   * public functions
   */

  public async fetchTokensByOwner({
    address,
    logger,
  }: IFetchTokensByOwnerOptions): Promise<IARC0072AssetHolding[]> {
    const _functionName = 'fetchTokensByOwner';
    let _error: string;
    let response: Response;
    let result: ITokensResponse;

    try {
      response = await fetch(
        `${this._baseURL}${this._apiPath}/tokens?owner=${address}`
      );
    } catch (error) {
      logger?.error(`${BaseARC0072Indexer.name}#${_functionName}:`, error);

      throw new NetworkConnectionError(error.message);
    }

    if (!response.ok) {
      _error = await response.text();

      logger?.error(`${BaseARC0072Indexer.name}#${_functionName}: ${_error}`);

      throw new UnknownError(_error);
    }

    result = await response.json();

    if (!result.tokens) {
      _error = 'result does not contain the "tokens" property';

      logger?.error(`${BaseARC0072Indexer.name}#${_functionName}: ${_error}`);

      throw new MalformedDataError(_error);
    }

    return result.tokens.map(({ contractId, metadata, tokenId }) => ({
      amount: '0',
      id: contractId.toString(),
      metadata: JSON.parse(metadata),
      tokenId: tokenId.toString(),
      type: AssetTypeEnum.ARC0072,
    }));
  }
}
