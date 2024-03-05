// errors
import {
  MalformedDataError,
  NetworkConnectionError,
  UnknownError,
} from '@extension/errors';

// types
import type {
  IARC0072AssetHolding,
  IARC0072IndexerFetchTokensByOwnerOptions,
} from '@extension/types';
import type { IResponse } from './types';
import { AssetTypeEnum } from '@extension/enums';

export default async function fetchVoiARC0072TokensByOwner({
  address,
  logger,
}: IARC0072IndexerFetchTokensByOwnerOptions): Promise<IARC0072AssetHolding[]> {
  const _functionName: string = 'fetchVoiARC0072TokensByOwner';
  let errorMessage: string;
  let response: Response;
  let result: IResponse;

  try {
    response = await fetch(
      `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens?owner=${address}`
    );
  } catch (error) {
    logger?.error(`${_functionName}:`, error);

    throw new NetworkConnectionError(error.message);
  }

  if (!response.ok) {
    errorMessage = await response.text();

    logger?.error(`${_functionName}: ${errorMessage}`);

    throw new UnknownError(errorMessage);
  }

  result = await response.json();

  if (!result.tokens) {
    errorMessage = 'result does not contain the "tokens" property';

    logger?.error(`${_functionName}: ${errorMessage}`);

    throw new MalformedDataError(errorMessage);
  }

  return result.tokens.map(({ contractId, metadata, tokenId }) => ({
    amount: '0',
    id: contractId.toString(),
    metadata: JSON.parse(metadata),
    tokenId: tokenId.toString(),
    type: AssetTypeEnum.ARC0072,
  }));
}
