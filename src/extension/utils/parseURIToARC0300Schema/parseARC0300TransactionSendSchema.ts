import { TransactionType } from 'algosdk';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IOptions, TTransactionSendSchemas } from './types';

// utils
import parseARC0300KeyRegistrationTransactionSendSchema from './parseARC0300KeyRegistrationTransactionSendSchema';

export default function parseARC0300TransactionSendSchema(
  scheme: string,
  paths: string[],
  searchParams: URLSearchParams,
  options: IOptions
): TTransactionSendSchemas | null {
  const _functionName = 'parseARC0300TransactionSendSchema';
  const logger = options?.logger;
  let typeParam: string | null;

  typeParam = searchParams.get(ARC0300QueryEnum.Type);

  if (!typeParam) {
    logger?.debug(`${_functionName}: no type param found`);

    return null;
  }

  switch (typeParam) {
    case TransactionType.keyreg:
      return parseARC0300KeyRegistrationTransactionSendSchema(
        scheme,
        paths,
        searchParams,
        options
      );
    default:
      logger?.debug(
        `${_functionName}: unknown type param "${typeParam}" for method "${ARC0300AuthorityEnum.Transaction}/${ARC0300PathEnum.Send}"`
      );

      return null;
  }
}
