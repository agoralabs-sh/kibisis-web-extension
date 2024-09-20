import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Transaction } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// services
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
  INetwork,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';

export default async function authorizedAccountsForEvent({
  accounts,
  event,
  logger,
  networks,
  sessions,
}: IOptions): Promise<IAccountWithExtendedProps[]> {
  const _functionName = 'authorizedAccountsForEvent';
  let _error: string;
  let account: IAccountWithExtendedProps | null;
  let accountInformation: IAccountInformation | null;
  let authorizedAddresses: string[];
  let base64EncodedGenesisHash: string;
  let decodedUnsignedTransactions: Transaction[];
  let network: INetwork | null;

  if (!event.payload.message.params) {
    _error = `no params in the event "${event.id}"`;

    logger?.debug(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  try {
    decodedUnsignedTransactions = event.payload.message.params.txns.map(
      (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
    );
  } catch (error) {
    _error = `failed to decode transactions: ${error.message}`;

    logger?.debug(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  return decodedUnsignedTransactions.reduce<IAccountWithExtendedProps[]>(
    (acc, currentValue) => {
      account =
        accounts.find(
          (value) =>
            value.publicKey ===
            PrivateKeyService.encode(currentValue.from.publicKey)
        ) || null;
      base64EncodedGenesisHash = encodeBase64(currentValue.genesisHash);
      authorizedAddresses = getAuthorizedAddressesForHost(
        event.payload.message.clientInfo.host,
        sessions.filter(
          (value) => value.genesisHash === base64EncodedGenesisHash
        )
      );
      network =
        networks.find(
          (value) => value.genesisHash === base64EncodedGenesisHash
        ) || null;
      accountInformation =
        account && network
          ? AccountRepositoryService.extractAccountInformationForNetwork(
              account,
              network
            )
          : null;

      // the from account is not an authorized account if:
      // * the account and account information is unknown for the network (inferred from the transaction's genesis hash)
      // * the account has already been added to the list
      // * the account is not in the authorized addresses for a session, matching the host and the genesis hash
      // * the account is a watch account but has not been re-keyed
      if (
        !account ||
        !accountInformation ||
        acc.find((value) => value.id === account?.id) ||
        !authorizedAddresses.find(
          (value) =>
            value === convertPublicKeyToAVMAddress(account?.publicKey || '')
        ) ||
        (account.watchAccount && !accountInformation.authAddress)
      ) {
        return acc;
      }

      return [...acc, account];
    },
    []
  );
}
