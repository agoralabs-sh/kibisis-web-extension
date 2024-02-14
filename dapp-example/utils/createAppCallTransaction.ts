import { decode as decodeBase64 } from '@stablelib/base64';
import {
  Algodv2,
  makeApplicationClearStateTxn,
  makeApplicationCloseOutTxn,
  makeApplicationCreateTxn,
  makeApplicationDeleteTxn,
  makeApplicationNoOpTxn,
  makeApplicationOptInTxn,
  makeApplicationUpdateTxn,
  SuggestedParams,
  Transaction,
  OnApplicationComplete,
} from 'algosdk';

// constants
import { TESTNET_APP_INDEX } from '../constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import { INetwork } from '@extension/types';

// utils
import getRandomAlgodClient from './getRandomAlgodClient';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
  suggestedParams?: SuggestedParams;
  type: TransactionTypeEnum;
}

export default async function createAppCallTransaction({
  from,
  network,
  note,
  suggestedParams,
  type,
}: IOptions): Promise<Transaction | null> {
  const appArgs: Uint8Array[] = [Uint8Array.from([0]), Uint8Array.from([0, 1])];
  const encodedApprovalProgram: string = 'BIEBMgkxABIxGYEED01D';
  const encodedClearProgram: string = 'BIEB';
  const client: Algodv2 = getRandomAlgodClient(network);
  const encoder: TextEncoder = new TextEncoder();
  const _suggestedParams: SuggestedParams =
    suggestedParams || (await client.getTransactionParams().do());

  switch (type) {
    case TransactionTypeEnum.ApplicationClearState:
      return makeApplicationClearStateTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationCloseOut:
      return makeApplicationCloseOutTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationCreate:
      return makeApplicationCreateTxn(
        from,
        _suggestedParams,
        OnApplicationComplete.NoOpOC,
        decodeBase64(encodedApprovalProgram),
        decodeBase64(encodedClearProgram),
        0,
        0,
        0,
        0,
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationDelete:
      return makeApplicationDeleteTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationNoOp:
      return makeApplicationNoOpTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationOptIn:
      return makeApplicationOptInTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationUpdate:
      return makeApplicationUpdateTxn(
        from,
        _suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        decodeBase64(encodedApprovalProgram),
        decodeBase64(encodedClearProgram),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    default:
      return null;
  }
}
