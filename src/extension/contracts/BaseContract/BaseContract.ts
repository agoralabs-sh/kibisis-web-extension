import { decode as decodeBase64 } from '@stablelib/base64';
import algosdk, {
  ABIAddressType,
  ABIContract,
  ABIStringType,
  ABIUintType,
  Algodv2,
  assignGroupID,
  decodeAddress,
  decodeObj,
  EncodedSignedTransaction,
  encodeUnsignedSimulateTransaction,
  getApplicationAddress,
  IntDecoding,
  makeApplicationNoOpTxn,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';

// constants
import { SIMULATE_MINIMUM_FEE } from './constants';

// errors
import { ReadABIContractError } from '@extension/errors';

// types
import type { ILogger } from '@common/types';
import type { IAlgorandAccountInformation } from '@extension/types';
import type {
  IABIResult,
  IBaseApplicationOptions,
  ICreateWriteApplicationTransactionOptions,
  IDetermineBoxReferencesOptions,
  INewOptions,
  IParseTransactionResponseOptions,
  ISimulateTransaction,
} from './types';

// utils
import createLogger from '@common/utils/createLogger';

export default class BaseContract {
  // protected
  protected _algod: Algodv2;
  protected _abi: ABIContract;
  protected _appId: string;
  protected _feeSinkAddress: string;
  protected readonly _logger: ILogger;

  constructor({ algod, appId, feeSinkAddress, logger }: INewOptions) {
    this._algod = algod;
    this._appId = appId;
    this._feeSinkAddress = feeSinkAddress;
    this._logger =
      logger || createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  }

  /**
   * public static functions
   */

  /**
   * Convenience function that converts a base64 encoded address arg to a string.
   * @param {string} arg - the base64 encoded application arg.
   * @returns {string} the address.
   */
  public static formatBase64EncodedAddressArg(arg: string): string {
    return new ABIAddressType().decode(decodeBase64(arg));
  }

  /**
   * Convenience function that converts a base64 encoded string arg to a string.
   * @param {string} arg - the base64 encoded application arg.
   * @returns {string} the string.
   */
  public static formatBase64EncodedStringArg(arg: string): string {
    return new ABIStringType().decode(decodeBase64(arg));
  }

  /**
   * Convenience function that converts a base64 encoded integer arg to a bigint.
   * @param {string} arg - the base64 encoded application arg.
   * @param {number} size - the size of the integer, e.g. uint64 = 64, uint256 = 256.
   * @returns {BigNumber} the integer as a BigNumber.
   */
  public static formatBase64EncodedUintArg(
    arg: string,
    size: number
  ): BigNumber {
    return new BigNumber(
      String(new ABIUintType(size).decode(decodeBase64(arg)))
    );
  }

  /**
   * protected functions
   */

  /**
   * Creates an application transaction that is used to read data.
   * @param {IBaseApplicationOptions} options - the options to create the application transactions.
   * @returns {Transaction} an application transaction.
   * @protected
   */
  protected async createReadApplicationTransaction({
    abiMethod,
    appArgs,
    suggestedParams,
  }: IBaseApplicationOptions): Promise<Transaction> {
    return makeApplicationNoOpTxn(
      this._feeSinkAddress,
      {
        ...(suggestedParams ?? (await this._algod.getTransactionParams().do())),
        fee: SIMULATE_MINIMUM_FEE,
        flatFee: true,
      },
      new BigNumber(this._appId).toNumber(),
      [
        abiMethod.getSelector(), // method name
        ...(appArgs ? appArgs : []), // the method parameters
      ]
    );
  }

  protected async createWriteApplicationTransaction({
    abiMethod,
    appArgs,
    boxes,
    fromAddress,
    note,
    suggestedParams,
  }: ICreateWriteApplicationTransactionOptions): Promise<Transaction> {
    return makeApplicationNoOpTxn(
      fromAddress,
      suggestedParams ?? (await this._algod.getTransactionParams().do()),
      new BigNumber(this._appId).toNumber(),
      [
        abiMethod.getSelector(), // method name
        ...(appArgs ? appArgs : []), // the method parameters
      ],
      undefined,
      undefined,
      undefined,
      note ? new TextEncoder().encode(note) : undefined,
      undefined,
      undefined,
      boxes
    );
  }

  /**
   * Simulates transactions that determine the required boxes that would need to be accessed.
   * @param {IDetermineBoxReferencesOptions} - the options needed to create an application write call.
   * @returns {algosdk.modelsv2.BoxReference[]} the required box references.
   * @protected
   */
  protected async determineBoxReferences({
    abiMethod,
    appArgs,
    authAddress,
    fromAddress,
    suggestedParams,
  }: IDetermineBoxReferencesOptions): Promise<
    algosdk.modelsv2.BoxReference[] | null
  > {
    const _functionName = 'determineBoxReferences';
    let response: algosdk.modelsv2.SimulateResponse;

    try {
      response = await this.simulateTransactions([
        {
          abiMethod,
          authAddress,
          transaction: await this.createWriteApplicationTransaction({
            abiMethod,
            appArgs,
            fromAddress,
            suggestedParams,
          }),
        },
      ]);

      return response.txnGroups[0].unnamedResourcesAccessed?.boxes || null;
    } catch (error) {
      this._logger.debug(
        `${BaseContract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }
  }

  protected parseTransactionResponse({
    abiMethod,
    response,
  }: IParseTransactionResponseOptions): IABIResult | null {
    const _functionName = 'parseTransactionResponse';
    const log = response.logs?.pop() || null; // get the first log
    let trimmedLog: Uint8Array;
    let type: string;

    if (!log) {
      this._logger.debug(
        `${BaseContract.name}#${_functionName}: no log found for application "${this._appId}" and method "${abiMethod.name}"`
      );

      return null;
    }

    trimmedLog = log.slice(4); // remove the prefix

    // if the abi is not expecting a return
    if (abiMethod.returns.type === 'void') {
      return null;
    }

    type = (abiMethod.returns.type as algosdk.ABIType).toString();

    // if we have an address, return as a string
    if (type.includes('address')) {
      return abiMethod.returns.type.decode(trimmedLog) as string;
    }

    // if we have bytes, return as a string
    if (type.includes('byte')) {
      return new TextDecoder().decode(trimmedLog);
    }

    // if we have a uint, decode as a bignumber
    if (type.includes('uint')) {
      return new BigNumber(
        String(abiMethod.returns.type.decode(trimmedLog) as bigint)
      );
    }

    return null;
  }

  protected async readByMethod({
    abiMethod,
    appArgs,
    suggestedParams,
  }: IBaseApplicationOptions): Promise<IABIResult | null> {
    const _functionName = 'readByMethod';
    let response: algosdk.modelsv2.SimulateResponse;
    let transaction: Transaction;

    try {
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appArgs,
        suggestedParams,
      });
      response = await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ]);

      if (response.txnGroups[0].failureMessage) {
        throw new ReadABIContractError(
          this._appId,
          response.txnGroups[0].failureMessage
        );
      }

      return this.parseTransactionResponse({
        abiMethod,
        response: response.txnGroups[0].txnResults[0].txnResult,
      });
    } catch (error) {
      this._logger.debug(
        `${BaseContract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }
  }

  /**
   * This simulates app call transactions, reads the logs and parses the responses. This is used to read data from an
   * application.
   * @param {ISimulateTransaction[]} simulateTransactions - the application transactions to simulate.
   * @returns {Promise<(IABIResult | null)[]>} returns the parsed logs from a simulated transactions.
   * @protected
   */
  protected async simulateTransactions(
    simulateTransactions: ISimulateTransaction[]
  ): Promise<algosdk.modelsv2.SimulateResponse> {
    const transactions = simulateTransactions.map((value) => value.transaction);
    let request: algosdk.modelsv2.SimulateRequest;

    assignGroupID(transactions);

    request = new algosdk.modelsv2.SimulateRequest({
      allowUnnamedResources: true,
      allowEmptySignatures: true,
      txnGroups: [
        new algosdk.modelsv2.SimulateRequestTransactionGroup({
          txns: transactions.map((value, index) => {
            const authAddress = simulateTransactions[index].authAddress;

            return {
              ...(decodeObj(
                encodeUnsignedSimulateTransaction(value)
              ) as EncodedSignedTransaction),
              ...(authAddress && {
                sgnr: Buffer.from(decodeAddress(authAddress).publicKey),
              }),
            };
          }),
        }),
      ],
    });

    return await this._algod
      .simulateTransactions(request)
      .setIntDecoding(IntDecoding.BIGINT)
      .do();
  }

  /**
   * Convenience function that simply removes the null bytes ("\x00") from a decoded string.
   * @param {string} input - the string to trim.
   * @returns {string} the string with the null bytes trimmed.
   * @protected
   */
  protected trimNullBytes(input: string): string {
    return input.replaceAll('\x00', '');
  }

  /**
   * public functions
   */

  /**
   * Gets the account address associated with the application.
   * @returns {string} the base32 encoded address for the application.
   */
  public applicationAddress(): string {
    return getApplicationAddress(BigInt(this._appId));
  }

  /**
   * Gets the account information for the account associated with the application.
   * @returns {Promise<IAlgorandAccountInformation>} the application's account information.
   */
  public async applicationAccountInformation(): Promise<IAlgorandAccountInformation> {
    return (await this._algod
      .accountInformation(this.applicationAddress())
      .do()) as IAlgorandAccountInformation;
  }

  public async boxByName(
    name: Uint8Array
  ): Promise<algosdk.modelsv2.Box | null> {
    const _functionName = 'boxByName';

    try {
      return await this._algod
        .getApplicationBoxByName(new BigNumber(this._appId).toNumber(), name)
        .do();
    } catch (error) {
      this._logger.debug(
        `${BaseContract.name}#${_functionName}: ${error.message}`
      );

      return null;
    }
  }
}
