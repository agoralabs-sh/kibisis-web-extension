import { isValidAddress, TransactionType } from 'algosdk';
import {
  decodeURLSafe as decodeBase64URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type { IARC0300CommonTransactionSendQuery } from '@extension/types';
import type { IOptions } from './types';

// utils
import isNumericString from '@extension/utils/isNumericString';

export default function parseARC0300CommonTransactionSendQuery(
  searchParams: URLSearchParams,
  { logger, supportedNetworks }: IOptions
): IARC0300CommonTransactionSendQuery | null {
  const _functionName = 'parseARC0300CommonTransactionSendQuery';
  const feeParam = searchParams.get(ARC0300QueryEnum.Fee);
  const firstValidParam = searchParams.get(ARC0300QueryEnum.FirstValid);
  const genesisHashParam = searchParams.get(ARC0300QueryEnum.GenesisHash);
  const groupParam = searchParams.get(ARC0300QueryEnum.Group);
  const lastValidParam = searchParams.get(ARC0300QueryEnum.LastValid);
  const leaseParam = searchParams.get(ARC0300QueryEnum.Lease);
  const noteParam = searchParams.get(ARC0300QueryEnum.Note);
  const reKeyToParam = searchParams.get(ARC0300QueryEnum.ReyKeyTo);
  const senderParam = searchParams.get(ARC0300QueryEnum.Sender);
  const typeParam = searchParams.get(ARC0300QueryEnum.Type);
  let genesisHash: string | null = null;

  if (!senderParam || !isValidAddress(senderParam)) {
    logger?.debug(`${_functionName}: invalid sender param`);

    return null;
  }

  if (
    !typeParam ||
    (typeParam !== TransactionType.acfg &&
      typeParam !== TransactionType.afrz &&
      typeParam !== TransactionType.appl &&
      typeParam !== TransactionType.axfer &&
      typeParam !== TransactionType.keyreg &&
      typeParam !== TransactionType.pay)
  ) {
    logger?.debug(`${_functionName}: invalid type param`);

    return null;
  }

  if (genesisHashParam) {
    // convert from base 64 url-safe to standard base64
    genesisHash = encodeBase64(decodeBase64URLSafe(genesisHashParam));

    if (!supportedNetworks.find((value) => value.genesisHash === genesisHash)) {
      logger?.debug(
        `${_functionName}: network with genesis hash "${genesisHash}" not supported`
      );

      return null;
    }
  }

  if (feeParam && !isNumericString(feeParam)) {
    logger?.debug(`${_functionName}: fee param is no a numeric value`);

    return null;
  }

  if (firstValidParam && !isNumericString(firstValidParam)) {
    logger?.debug(`${_functionName}: "firstvalid" param is no a numeric value`);

    return null;
  }

  if (lastValidParam && !isNumericString(lastValidParam)) {
    logger?.debug(`${_functionName}: "lastvalid" param is no a numeric value`);

    return null;
  }

  if (reKeyToParam && !isValidAddress(reKeyToParam)) {
    logger?.debug(`${_functionName}: "reykeyto" param is not a valid address`);

    return null;
  }

  return {
    [ARC0300QueryEnum.Sender]: senderParam,
    [ARC0300QueryEnum.Type]: typeParam as TransactionType,
    ...(feeParam && {
      [ARC0300QueryEnum.Fee]: feeParam,
    }),
    ...(firstValidParam && {
      [ARC0300QueryEnum.FirstValid]: firstValidParam,
    }),
    ...(genesisHash && {
      [ARC0300QueryEnum.GenesisHash]: genesisHash,
    }),
    ...(groupParam && {
      [ARC0300QueryEnum.Group]: encodeBase64(decodeBase64URLSafe(groupParam)),
    }),
    ...(lastValidParam && {
      [ARC0300QueryEnum.LastValid]: lastValidParam,
    }),
    ...(leaseParam && {
      [ARC0300QueryEnum.Lease]: encodeBase64(decodeBase64URLSafe(leaseParam)),
    }),
    ...(noteParam && {
      [ARC0300QueryEnum.Note]: encodeBase64(decodeBase64URLSafe(noteParam)),
    }),
    ...(reKeyToParam && {
      [ARC0300QueryEnum.ReyKeyTo]: reKeyToParam,
    }),
  };
}
