import algosdk, {
  ABIContract,
  Algodv2,
  assignGroupID,
  decodeObj,
  EncodedSignedTransaction,
  encodeUnsignedSimulateTransaction,
  IntDecoding,
  makeApplicationNoOpTxn,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// constants
import { SIMULATE_MINIMUM_FEE } from './constants';

// types
import type { ILogger } from '@common/types';
import type { INetwork } from '@extension/types';
import type {
  IABIResult,
  ICreateReadApplicationTransactionOptions,
  INewBaseContractOptions,
  IParseTransactionResponseOptions,
  ISimulateTransaction,
} from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import createLogger from '@common/utils/createLogger';

export default class BaseContract {
  // protected
  protected abi: ABIContract;
  protected algodClient: Algodv2;
  protected readonly logger: ILogger;
  protected network: INetwork;

  constructor({ logger, network }: INewBaseContractOptions) {
    this.logger =
      logger || createLogger(__ENV__ === 'development' ? 'debug' : 'error');
    this.algodClient = createAlgodClient(network, { logger });
    this.network = network;
  }

  /**
   * private functions
   */

  private parseTransactionResponse({
    abiMethod,
    appId,
    response,
  }: IParseTransactionResponseOptions): IABIResult | null {
    const _functionName: string = 'parseTransactionResponse';
    const log: Uint8Array | null = response.logs?.pop() || null; // get the first log
    let trimmedLog: Uint8Array;
    let type: string;

    if (!log) {
      this.logger.debug(
        `${
          BaseContract.name
        }#${_functionName}: no log found for application "${appId.toString()}" and method "${
          abiMethod.name
        }"`
      );

      return null;
    }

    trimmedLog = log.slice(4); // remove the prefix

    // if the abi is not expecting a return
    if (abiMethod.returns.type === 'void') {
      return null;
    }

    type = (abiMethod.returns.type as algosdk.ABIType).toString();

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

  /**
   * protected functions
   */

  /**
   * Creates an application transaction that is used to read data.
   * @param {ICreateReadApplicationTransactionOptions} options - the options to create the application transactions.
   * @returns {Transaction} an application transaction.
   * @protected
   */
  protected async createReadApplicationTransaction({
    abiMethod,
    appArgs,
    appId,
  }: ICreateReadApplicationTransactionOptions): Promise<Transaction> {
    const suggestedParams: SuggestedParams = await this.algodClient
      .getTransactionParams()
      .do();

    return makeApplicationNoOpTxn(
      this.network.feeSunkAddress, // use an address that contains some algos
      {
        ...suggestedParams,
        fee: SIMULATE_MINIMUM_FEE,
        flatFee: true,
      },
      appId.toNumber(),
      [
        abiMethod.getSelector(), // method name
        ...(appArgs ? appArgs : []), // the method parameters
      ]
    );
  }

  /**
   * This simulates app call transactions, reads the logs and parses the responses. This is used to read data from an
   * application.
   * @param {BigNumber} appId - the application ID.
   * @param {ISimulateTransaction[]} simulateTransactions - the application transactions to simulate.
   * @returns {Promise<(IABIResult | null)[]>} returns the parsed logs from a simulated transactions.
   * @protected
   */
  protected async simulateTransactions(
    appId: BigNumber,
    simulateTransactions: ISimulateTransaction[]
  ): Promise<(IABIResult | null)[]> {
    const transactions: Transaction[] = simulateTransactions.map(
      (value) => value.transaction
    );
    let request: algosdk.modelsv2.SimulateRequest;
    let response: algosdk.modelsv2.SimulateResponse;

    try {
      assignGroupID(transactions);

      request = new algosdk.modelsv2.SimulateRequest({
        allowUnnamedResources: true,
        allowEmptySignatures: true,
        txnGroups: [
          new algosdk.modelsv2.SimulateRequestTransactionGroup({
            txns: transactions.map(
              (value) =>
                decodeObj(
                  encodeUnsignedSimulateTransaction(value)
                ) as EncodedSignedTransaction
            ),
          }),
        ],
      });
      response = await this.algodClient
        .simulateTransactions(request)
        .setIntDecoding(IntDecoding.BIGINT)
        .do();

      return response.txnGroups[0].txnResults.map((value, index) =>
        this.parseTransactionResponse({
          abiMethod: simulateTransactions[index].abiMethod,
          appId,
          response: value.txnResult,
        })
      );
    } catch (error) {
      throw error;
    }
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

  public setNetwork(network: INetwork): void {
    this.algodClient = createAlgodClient(network, { logger: this.logger });
    this.network = network;
  }
}
